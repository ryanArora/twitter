import { db } from "@repo/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getUserProfileWithUrls } from "./asset";
import { selectUserProfile } from "./user";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const FOLLOWS_PER_REQUEST = 10;

export const followRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        profileId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.id === input.profileId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await db.follow.create({
        data: {
          followedId: input.profileId,
          followerId: ctx.session.user.id,
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        profileId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db.follow.delete({
        where: {
          followerId_followedId: {
            followedId: input.profileId,
            followerId: ctx.session.user.id,
          },
        },
      });
    }),
  timelineFollowers: protectedProcedure
    .input(
      z.object({
        cursor: z.string().min(1).optional(),
        userId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const followers = (
        await db.follow.findMany({
          cursor: input.cursor
            ? {
                followerId_followedId: {
                  followedId: input.userId,
                  followerId: input.cursor,
                },
              }
            : undefined,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            follower: {
              select: selectUserProfile(ctx.session.user.id),
            },
          },
          take: FOLLOWS_PER_REQUEST + 1,
          where: {
            followedId: input.userId,
          },
        })
      )
        .map((follow) => follow.follower)
        .map((user) => getUserProfileWithUrls(user));

      let nextCursor: typeof input.cursor = undefined;
      if (followers.length > FOLLOWS_PER_REQUEST) {
        const nextItem = followers.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        followers,
        nextCursor,
      };
    }),
  timelineFollowing: protectedProcedure
    .input(
      z.object({
        cursor: z.string().min(1).optional(),
        userId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const following = (
        await db.follow.findMany({
          cursor: input.cursor
            ? {
                followerId_followedId: {
                  followedId: input.cursor,
                  followerId: input.userId,
                },
              }
            : undefined,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            followed: {
              select: selectUserProfile(ctx.session.user.id),
            },
          },
          take: FOLLOWS_PER_REQUEST + 1,
          where: {
            followerId: input.userId,
          },
        })
      )
        .map((follow) => follow.followed)
        .map((user) => getUserProfileWithUrls(user));

      let nextCursor: typeof input.cursor = undefined;
      if (following.length > FOLLOWS_PER_REQUEST) {
        const nextItem = following.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        following,
        nextCursor,
      };
    }),
});
