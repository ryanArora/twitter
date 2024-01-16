import { db } from "@repo/db";
import { z } from "zod";
import { postTweetSchema } from "../schemas/tweet";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const tweetRouter = createTRPCRouter({
  post: protectedProcedure
    .input(postTweetSchema)
    .mutation(async ({ ctx, input }) => {
      return await db.tweet.create({
        data: {
          authorId: ctx.session.user.id,
          content: input.content,
          views: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
    }),
  getTimeline: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(10),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const tweets = await db.tweet.findMany({
        where: {
          parent: null,
          author: {
            followers: {
              some: {
                followerId: {
                  equals: ctx.session.user.id,
                },
              },
            },
          },
        },
        select: {
          id: true,
          content: true,
          attachments: true,
          _count: {
            select: { likes: true, replies: true, retweets: true, views: true },
          },
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              profilePictureUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        cursor: input.cursor
          ? {
              id: input.cursor,
            }
          : undefined,
        take: input.limit + 1,
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (tweets.length > input.limit) {
        const nextItem = tweets.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        tweets,
        nextCursor,
      };
    }),
});