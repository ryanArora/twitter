import { z } from "zod";

export const postTweetSchema = z.object({
  content: z
    .string()
    .min(1, "Your tweet content must not be empty")
    .max(280, "Your tweet must be no more than 280 characters long."),
  attachments: z
    .array(
      z
        .string()
        .min(1, "Your attachment URL must not be empty.")
        .max(
          2048,
          "Your attachment URL must be no more than 2048 characters long.",
        )
        .url("Your attachment must be a valid URL."),
    )
    .max(4, "Your tweet must have no more than 4 attachments"),
});
