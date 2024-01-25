import { type Prisma, db } from "@repo/db";
import { z } from "zod";
import { getUserProfileWithUrls } from "./asset";
import { updateUserSchema } from "../schemas/user";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export type UserBasicWithoutAvatarUrl = Prisma.UserGetPayload<{
  select: typeof selectUserBasic;
}>;

export type UserBasic = UserBasicWithoutAvatarUrl & { avatarUrl: string };

export const selectUserBasic = {
  id: true,
  name: true,
  username: true,
} satisfies Prisma.UserSelect;

export type UserProfileWithoutUrls = Prisma.UserGetPayload<{
  select: ReturnType<typeof selectUserProfile>;
}>;

export type UserProfile = UserProfileWithoutUrls & {
  avatarUrl: string;
  bannerUrl: string;
};

export const selectUserProfile = (sessionUserId: string) => {
  return {
    ...selectUserBasic,
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
      const user = await db.user.findUnique({
        where: {
          usernameLower: input.username.toLowerCase(),
        },
        select: selectUserProfile(ctx.session.user.id),
      });

      if (!user) return null;
      return getUserProfileWithUrls(user);
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await db.user.findUnique({
        where: {
          id: input.id,
        },
        select: selectUserProfile(ctx.session.user.id),
      });

      if (!user) return null;
      return getUserProfileWithUrls(user);
    }),
  update: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      return await db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          username: input.username,
          usernameLower: input.username?.toLowerCase(),
          name: input.name,
          bio: input.bio,
        },
        select: { id: true }, // Need to select something...
      });
    }),
});
