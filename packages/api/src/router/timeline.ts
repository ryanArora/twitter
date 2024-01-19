import { db } from "@repo/db";
import { z } from "zod";
import { type TweetBasic, selectTweetBasic } from "./tweet";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const TWEETS_PER_REQUEST = 10;

export type TimelineReturn = {
  tweets: TweetBasic[];
  nextCursor: string | undefined;
};

export const timelineInputSchema = z.object({
  cursor: z.string().optional(),
  authorId: z.string(),
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
        tweets,
        nextCursor,
      };
    }),
  profile: protectedProcedure
    .input(timelineInputSchema)
    .query(async ({ ctx, input }): Promise<TimelineReturn> => {
      const tweets = await db.tweet.findMany({
        where: {
          parent: null,
          authorId: input.authorId,
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
        tweets,
        nextCursor,
      };
    }),
});
