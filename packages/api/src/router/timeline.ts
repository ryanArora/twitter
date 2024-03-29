import { db } from "@repo/db";
import { z } from "zod";
import { getTweetsWithUrls } from "./asset";
import { type TweetBasic, selectTweetBasic } from "./tweet";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const TWEETS_PER_REQUEST = 10;

export type TimelineReturn = {
  nextCursor: string | undefined;
  tweets: TweetBasic[];
};

export const timelineInputSchema = z.object({
  cursor: z.string().optional(),
  profile_userId: z.string(),
  tweetReplies_parentId: z.string(),
});

export type TimelineInput = z.infer<typeof timelineInputSchema>;

export const timelineRouter = createTRPCRouter({
  bookmarks: protectedProcedure
    .input(timelineInputSchema)
    .query(async ({ ctx, input }) => {
      const tweets = (
        await db.bookmark.findMany({
          cursor: input.cursor
            ? {
                userId_tweetId: {
                  tweetId: input.cursor,
                  userId: ctx.session.user.id,
                },
              }
            : undefined,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            tweet: {
              select: selectTweetBasic(ctx.session.user.id),
            },
          },
          take: TWEETS_PER_REQUEST + 1,
          where: {
            userId: ctx.session.user.id,
          },
        })
      ).map((bookmark) => bookmark.tweet);

      let nextCursor: typeof input.cursor = undefined;
      if (tweets.length > TWEETS_PER_REQUEST) {
        const nextItem = tweets.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        nextCursor,
        tweets: getTweetsWithUrls(tweets),
      };
    }),
  home: protectedProcedure
    .input(timelineInputSchema)
    .query(async ({ ctx, input }): Promise<TimelineReturn> => {
      const tweets = await db.tweet.findMany({
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        select: selectTweetBasic(ctx.session.user.id),
        take: TWEETS_PER_REQUEST + 1,
        where: {
          author: {
            followers: {
              some: {
                followerId: {
                  equals: ctx.session.user.id,
                },
              },
            },
          },
          parent: null,
        },
      });

      let nextCursor: typeof input.cursor = undefined;
      if (tweets.length > TWEETS_PER_REQUEST) {
        const nextItem = tweets.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        nextCursor,
        tweets: getTweetsWithUrls(tweets),
      };
    }),
  profileHome: protectedProcedure
    .input(timelineInputSchema)
    .query(async ({ ctx, input }): Promise<TimelineReturn> => {
      const tweets = await db.tweet.findMany({
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        select: selectTweetBasic(ctx.session.user.id),
        take: TWEETS_PER_REQUEST + 1,
        where: {
          authorId: input.profile_userId,
          parent: null,
        },
      });

      let nextCursor: typeof input.cursor = undefined;
      if (tweets.length > TWEETS_PER_REQUEST) {
        const nextItem = tweets.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        nextCursor,
        tweets: getTweetsWithUrls(tweets),
      };
    }),
  profileLikes: protectedProcedure
    .input(timelineInputSchema)
    .query(async ({ ctx, input }): Promise<TimelineReturn> => {
      const tweets = (
        await db.like.findMany({
          cursor: input.cursor
            ? {
                userId_tweetId: {
                  tweetId: input.cursor,
                  userId: input.profile_userId,
                },
              }
            : undefined,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            tweet: { select: selectTweetBasic(ctx.session.user.id) },
          },
          take: TWEETS_PER_REQUEST + 1,
          where: {
            userId: input.profile_userId,
          },
        })
      ).map((like) => like.tweet);

      let nextCursor: typeof input.cursor = undefined;
      if (tweets.length > TWEETS_PER_REQUEST) {
        const nextItem = tweets.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        nextCursor,
        tweets: getTweetsWithUrls(tweets),
      };
    }),
  profileMedia: protectedProcedure
    .input(timelineInputSchema)
    .query(async ({ ctx, input }): Promise<TimelineReturn> => {
      const tweets = await db.tweet.findMany({
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        select: selectTweetBasic(ctx.session.user.id),
        take: TWEETS_PER_REQUEST + 1,
        where: {
          attachments: {
            some: {},
          },
          authorId: input.profile_userId,
        },
      });

      let nextCursor: typeof input.cursor = undefined;
      if (tweets.length > TWEETS_PER_REQUEST) {
        const nextItem = tweets.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        nextCursor,
        tweets: getTweetsWithUrls(tweets),
      };
    }),
  profileReplies: protectedProcedure
    .input(timelineInputSchema)
    .query(async ({ ctx, input }): Promise<TimelineReturn> => {
      const tweets = await db.tweet.findMany({
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        select: selectTweetBasic(ctx.session.user.id),
        take: TWEETS_PER_REQUEST + 1,
        where: {
          authorId: input.profile_userId,
        },
      });

      let nextCursor: typeof input.cursor = undefined;
      if (tweets.length > TWEETS_PER_REQUEST) {
        const nextItem = tweets.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        nextCursor,
        tweets: getTweetsWithUrls(tweets),
      };
    }),
  tweetReplies: protectedProcedure
    .input(timelineInputSchema)
    .query(async ({ ctx, input }): Promise<TimelineReturn> => {
      const tweets = await db.tweet.findMany({
        orderBy: {
          createdAt: "desc",
        },
        select: selectTweetBasic(ctx.session.user.id),
        where: {
          parentId: input.tweetReplies_parentId,
        },
      });

      let nextCursor: typeof input.cursor = undefined;
      if (tweets.length > TWEETS_PER_REQUEST) {
        const nextItem = tweets.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        nextCursor,
        tweets: getTweetsWithUrls(tweets),
      };
    }),
});
