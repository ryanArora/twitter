import { db } from "@repo/db";
import { z } from "zod";
import { getTweetsWithUrls } from "./asset";
import { type TweetBasic, selectTweetBasic } from "./tweet";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const TWEETS_PER_REQUEST = 10;

export type TimelineReturn = {
  tweets: TweetBasic[];
  nextCursor: string | undefined;
};

export const timelineInputSchema = z.object({
  cursor: z.string().optional(),
  profile_userId: z.string(),
  tweetReplies_parentId: z.string(),
});

export type TimelineInput = z.infer<typeof timelineInputSchema>;

export const timelineRouter = createTRPCRouter({
  home: protectedProcedure
    .input(timelineInputSchema)
    .query(async ({ ctx, input }): Promise<TimelineReturn> => {
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
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: TWEETS_PER_REQUEST + 1,
      });

      let nextCursor: typeof input.cursor = undefined;
      if (tweets.length > TWEETS_PER_REQUEST) {
        const nextItem = tweets.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        tweets: getTweetsWithUrls(tweets),
        nextCursor,
      };
    }),
  profileHome: protectedProcedure
    .input(timelineInputSchema)
    .query(async ({ ctx, input }): Promise<TimelineReturn> => {
      const tweets = await db.tweet.findMany({
        where: {
          parent: null,
          authorId: input.profile_userId,
        },
        select: selectTweetBasic(ctx.session.user.id),
        orderBy: {
          createdAt: "desc",
        },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: TWEETS_PER_REQUEST + 1,
      });

      let nextCursor: typeof input.cursor = undefined;
      if (tweets.length > TWEETS_PER_REQUEST) {
        const nextItem = tweets.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        tweets: getTweetsWithUrls(tweets),
        nextCursor,
      };
    }),
  profileReplies: protectedProcedure
    .input(timelineInputSchema)
    .query(async ({ ctx, input }): Promise<TimelineReturn> => {
      const tweets = await db.tweet.findMany({
        where: {
          authorId: input.profile_userId,
        },
        select: selectTweetBasic(ctx.session.user.id),
        orderBy: {
          createdAt: "desc",
        },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: TWEETS_PER_REQUEST + 1,
      });

      let nextCursor: typeof input.cursor = undefined;
      if (tweets.length > TWEETS_PER_REQUEST) {
        const nextItem = tweets.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        tweets: getTweetsWithUrls(tweets),
        nextCursor,
      };
    }),
  profileMedia: protectedProcedure
    .input(timelineInputSchema)
    .query(async ({ ctx, input }): Promise<TimelineReturn> => {
      const tweets = await db.tweet.findMany({
        where: {
          authorId: input.profile_userId,
          attachments: {
            some: {},
          },
        },
        select: selectTweetBasic(ctx.session.user.id),
        orderBy: {
          createdAt: "desc",
        },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: TWEETS_PER_REQUEST + 1,
      });

      let nextCursor: typeof input.cursor = undefined;
      if (tweets.length > TWEETS_PER_REQUEST) {
        const nextItem = tweets.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        tweets: getTweetsWithUrls(tweets),
        nextCursor,
      };
    }),
  profileLikes: protectedProcedure
    .input(timelineInputSchema)
    .query(async ({ ctx, input }): Promise<TimelineReturn> => {
      const likes = await db.like.findMany({
        where: {
          userId: input.profile_userId,
        },
        select: {
          createdAt: true,
          tweet: { select: selectTweetBasic(ctx.session.user.id) },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const tweets = likes.map((like) => like.tweet);

      let nextCursor: typeof input.cursor = undefined;
      if (tweets.length > TWEETS_PER_REQUEST) {
        const nextItem = tweets.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        tweets: getTweetsWithUrls(tweets),
        nextCursor,
      };
    }),
  tweetReplies: protectedProcedure
    .input(timelineInputSchema)
    .query(async ({ ctx, input }): Promise<TimelineReturn> => {
      const tweets = await db.tweet.findMany({
        where: {
          parentId: input.tweetReplies_parentId,
        },
        select: selectTweetBasic(ctx.session.user.id),
      });

      let nextCursor: typeof input.cursor = undefined;
      if (tweets.length > TWEETS_PER_REQUEST) {
        const nextItem = tweets.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        tweets: getTweetsWithUrls(tweets),
        nextCursor,
      };
    }),
});
