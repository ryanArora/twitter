import { deleteObjects, getSignedUrl, postSignedUrl } from "@repo/aws";
import { db } from "@repo/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { type TweetBasic, type TweetBasicWithoutUrls } from "./tweet";
import {
  type UserBasicWithoutAvatarUrl,
  type UserBasic,
  type UserProfile,
  type UserProfileWithoutUrls,
} from "./user";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export function getUserWithAvatarUrl(
  user: UserBasicWithoutAvatarUrl,
): UserBasic {
  return {
    ...user,
    avatarUrl: getSignedUrl(`avatars/${user.id}`),
  };
}

export function getUserProfileWithUrls(
  user: UserProfileWithoutUrls,
): UserProfile {
  return {
    ...user,
    avatarUrl: getSignedUrl(`avatars/${user.id}`),
    bannerUrl: getSignedUrl(`banners/${user.id}`),
  };
}

export function getTweetWithUrls(tweet: TweetBasicWithoutUrls) {
  return {
    ...tweet,
    author: getUserWithAvatarUrl(tweet.author),
    attachments: tweet.attachments.map((attachment) => ({
      ...attachment,
      url: getSignedUrl(`attachments/${attachment.id}`),
    })),
  };
}

export function getTweetsWithUrls(
  tweets: TweetBasicWithoutUrls[],
): TweetBasic[] {
  return tweets.map(getTweetWithUrls);
}

export const assetRouter = createTRPCRouter({
  getPostUrl: protectedProcedure
    .input(z.object({ resource: z.enum(["avatars", "banners"]) }))
    .query(({ ctx, input }) => {
      return postSignedUrl(`${input.resource}/${ctx.session.user.id}`);
    }),
  createAttachment: protectedProcedure
    .input(z.object({ width: z.number(), height: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const attachment = await db.attachment.create({
        data: {
          userId: ctx.session.user.id,
          tweetId: null,
          width: input.width,
          height: input.height,
        },
        select: { id: true },
      });

      return {
        attachmentId: attachment.id,
        presignedPost: postSignedUrl(`attachments/${attachment.id}`),
      };
    }),
  deleteLooseAttachment: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const attachment = await db.attachment.findUnique({
        where: { id: input.id },
        select: { userId: true, tweetId: true },
      });

      if (
        attachment === null ||
        attachment.tweetId !== null ||
        attachment.userId !== ctx.session.user.id
      ) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await deleteObjects([`attachments/${input.id}`]);
      await db.attachment.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
