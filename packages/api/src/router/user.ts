import { type Prisma, db } from "@repo/db";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export type UserBasic = Prisma.UserGetPayload<{
  select: typeof selectUserBasic;
}>;

export const selectUserBasic = {
  id: true,
  name: true,
  username: true,
  profilePictureUrl: true,
} satisfies Prisma.UserSelect;

export type UserProfile = Prisma.UserGetPayload<{
  select: ReturnType<typeof selectUserProfile>;
}>;

export const selectUserProfile = (sessionUserId: string) => {
  return {
    ...selectUserBasic,
    bannerUrl: true,
    createdAt: true,
    bio: true,
    _count: {
      select: {
        tweets: true,
        followers: true,
        following: true,
      },
    },
    followers: {
      where: {
        OR: [
          { followerId: sessionUserId },
          {
            follower: {
              followers: {
                some: { followerId: { equals: sessionUserId } },
              },
            },
          },
        ],
      },
      select: {
        createdAt: true,
        follower: { select: selectUserBasic },
      },
    },
    following: {
      where: {
        OR: [
          { followedId: sessionUserId },
          {
            followed: {
              followers: {
                some: { followedId: { equals: sessionUserId } },
              },
            },
          },
        ],
      },
      select: {
        createdAt: true,
        follower: { select: selectUserBasic },
      },
    },
  } satisfies Prisma.UserSelect;
};

export const userRouter = createTRPCRouter({
  find: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      return await db.user.findUnique({
        where: {
          usernameLower: input.username.toLowerCase(),
        },
        select: selectUserProfile(ctx.session.user.id),
      });
    }),
});
