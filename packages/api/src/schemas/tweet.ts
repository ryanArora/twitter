import { z } from "zod";

export const tweetContentSchema = z.string().max(280);
export const tweetAttachmentsSchema = z.array(z.string().min(1)).max(4);

export const postTweetSchema = z
  .object({
    attachmentIds: tweetAttachmentsSchema,
    content: tweetContentSchema,
    parentTweetId: z.string().min(1).nullable(),
  })
  .refine(
    (tweet) => tweet.attachmentIds.length > 0 || tweet.content.length > 0,
    "Your tweet must not be empty.",
  );
