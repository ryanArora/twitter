import { deleteObjects } from "@repo/aws";
import { type Prisma, db } from "@repo/db";
import { TRPCError } from "@trpc/server";
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
  "attachments" | "author"
> & {
  attachments: (TweetBasicWithoutUrls["attachments"][number] & {
    url: string;
  })[];
  author: TweetBasicWithoutUrls["author"] & { avatarUrl: string };
};

export const selectTweetBasic = (sessionUserId: string) => {
  return {
    _count: {
      select: {
        likes: true,
        replies: true,
        retweets: true,
        views: true,
      },
    },
    attachments: {
      select: {
        height: true,
        id: true,
        width: true,
      },
    },
    author: {
      select: selectUserBasic,
    },
    content: true,
    createdAt: true,
    id: true,
    likes: {
      select: {
        createdAt: true,
        user: { select: selectUserBasic },
      },
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
    },
    retweets: {
      select: {
        createdAt: true,
        user: { select: selectUserBasic },
      },
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
    },
  } satisfies Prisma.TweetSelect;
};

export const tweetRouter = createTRPCRouter({
  create: protectedProcedure
    .input(postTweetSchema)
    .mutation(async ({ ctx, input }) => {
      const attachments = await db.attachment.findMany({
        select: { id: true },
        where: {
          id: {
            in: input.attachmentIds,
          },
          userId: ctx.session.user.id,
        },
      });

      return await db.tweet.create({
        data: {
          attachments: {
            connect: attachments,
          },
          authorId: ctx.session.user.id,
          content: input.content,
          parentId: input.parentTweetId,
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
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await db.$transaction(async (tx) => {
        const tweet = await tx.tweet.findUnique({
          select: { attachments: { select: { id: true } } },
          where: { authorId: ctx.session.user.id, id: input.id },
        });

        if (!tweet) throw new TRPCError({ code: "UNAUTHORIZED" });

        if (tweet.attachments.length > 0) {
          await deleteObjects(
            tweet.attachments.map(
              (attachment) => `attachments/${attachment.id}` as const,
            ),
          );
        }

        await db.tweet.delete({ where: { id: input.id } });
      });
    }),
  find: protectedProcedure
    .input(z.object({ id: z.string(), username: z.string() }))
    .query(async ({ ctx, input }): Promise<TweetBasic | null> => {
      const tweet = await db.tweet.findUnique({
        select: selectTweetBasic(ctx.session.user.id),
        where: {
          id: input.id,
        },
      });

      if (!tweet) return null;

      const realUsernameLower = tweet.author.username.toLowerCase();
      const fakeUsernameLower = input.username.toLowerCase();

      if (realUsernameLower !== fakeUsernameLower) return null;

      return getTweetWithUrls(tweet);
    }),
});
