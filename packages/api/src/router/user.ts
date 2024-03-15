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
    _count: {
      select: {
        followers: true,
        following: true,
        tweets: true,
      },
    },
    bio: true,
    createdAt: true,
    followers: {
      select: {
        createdAt: true,
        follower: { select: selectUserBasic },
      },
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
    },
    following: {
      select: {
        createdAt: true,
        follower: { select: selectUserBasic },
      },
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
    },
  } satisfies Prisma.UserSelect;
};

export const userRouter = createTRPCRouter({
  find: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await db.user.findUnique({
        select: selectUserProfile(ctx.session.user.id),
        where: {
          usernameLower: input.username.toLowerCase(),
        },
      });

      if (!user) return null;
      return getUserProfileWithUrls(user);
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await db.user.findUnique({
        select: selectUserProfile(ctx.session.user.id),
        where: {
          id: input.id,
        },
      });

      if (!user) return null;
      return getUserProfileWithUrls(user);
    }),
  update: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      return await db.user.update({
        data: {
          bio: input.bio,
          name: input.name,
          username: input.username,
          usernameLower: input.username?.toLowerCase(),
        },
        select: { id: true }, // Need to select something...
        where: {
          id: ctx.session.user.id,
        },
      });
    }),
});
