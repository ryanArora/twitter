import { db, type Prisma } from "@repo/db";
import { z } from "zod";
import { getTweetWithUrls } from "./asset";
import { selectUserBasic } from "./user";
import { postTweetSchema } from "../schemas/tweet";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export type TweetBasicWithoutUrls = Prisma.TweetGetPayload<{
  select: ReturnType<typeof selectTweetBasic>;
}>;

export type TweetBasic = Omit<
  TweetBasicWithoutUrls,
  "author" | "attachments"
> & {
  author: TweetBasicWithoutUrls["author"] & { avatarUrl: string };
  attachments: (TweetBasicWithoutUrls["attachments"][number] & {
    url: string;
  })[];
};

export const selectTweetBasic = (sessionUserId: string) => {
  return {
    id: true,
    content: true,
    attachments: {
      select: {
        id: true,
        width: true,
        height: true,
      },
    },
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
      const attachments = await db.attachment.findMany({
        where: {
          userId: ctx.session.user.id,
          id: {
            in: input.attachmentIds,
          },
        },
        select: { id: true },
      });

      return await db.tweet.create({
        data: {
          authorId: ctx.session.user.id,
          content: input.content,
          attachments: {
            connect: attachments,
          },
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
    .query(async ({ ctx, input }): Promise<TweetBasic | null> => {
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

      return getTweetWithUrls(tweet);
    }),
});
