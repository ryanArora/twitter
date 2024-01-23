import { z } from "zod";

export const tweetContentSchema = z
  .string()
  .min(1, "Your tweet content must not be empty")
  .max(280, "Your tweet must be no more than 280 characters long.");

export const tweetAttachmentsSchema = z
  .array(z.string().min(1, "Your attachment URL must not be empty."))
  .max(4, "Your tweet must have no more than 4 attachments");

export const postTweetSchema = z.object({
  content: tweetContentSchema,
  attachments: tweetAttachmentsSchema,
});
