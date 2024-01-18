import { db, type Prisma } from "@repo/db";
import { z } from "zod";
import { selectUserBasic } from "./user";
import { postTweetSchema } from "../schemas/tweet";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const selectTweetBasic = (sessionUserId: string) => {
  return {
    id: true,
    content: true,
    attachments: true,
    createdAt: true,
    _count: {
      select: {
        replies: true,
        retweets: true,
        likes: true,
        views: true,
      },
    },
    author: {
      select: selectUserBasic,
    },
    likes: {
      where: {
        OR: [
          { userId: sessionUserId },
          {
            user: {
              followers: {
                some: { followerId: { equals: sessionUserId } },
              },
            },
          },
        ],
      },
      select: {
        createdAt: true,
        user: { select: selectUserBasic },
      },
    },
    retweets: {
      where: {
        OR: [
          { userId: sessionUserId },
          {
            user: {
              followers: {
                some: { followerId: { equals: sessionUserId } },
              },
            },
          },
        ],
      },
      select: {
        createdAt: true,
        user: { select: selectUserBasic },
      },
    },
  } satisfies Prisma.TweetSelect;
};

export const tweetRouter = createTRPCRouter({
  create: protectedProcedure
    .input(postTweetSchema)
    .mutation(async ({ ctx, input }) => {
      return await db.tweet.create({
        data: {
          authorId: ctx.session.user.id,
          content: input.content,
          views: {
            create: {
              userId: ctx.session.user.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
    }),
  find: protectedProcedure
    .input(z.object({ id: z.string(), username: z.string() }))
    .query(async ({ ctx, input }) => {
      const tweet = await db.tweet.findUnique({
        where: {
          id: input.id,
        },
        select: selectTweetBasic(ctx.session.user.id),
      });

      if (!tweet) return null;

      const realUsernameLower = tweet.author.username.toLowerCase();
      const fakeUsernameLower = input.username.toLowerCase();

      if (realUsernameLower !== fakeUsernameLower) return null;

      return tweet;
    }),
  timeline: protectedProcedure
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
        select: selectTweetBasic(ctx.session.user.id),
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
