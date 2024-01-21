import { s3 } from "@repo/aws";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const FIFTEEN_MINUTES = 60 * 15;

const BUCKET_NAME = "twitter.ryna.dev-assets";

export const assetRouter = createTRPCRouter({
  getPutUrl: protectedProcedure
    .input(
      z.object({
        path: z.enum(["avatars", "banners"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      return s3.getSignedUrl("putObject", {
        Bucket: BUCKET_NAME,
        Key: `${input.path}/${ctx.session.user.id}`,
        Expires: FIFTEEN_MINUTES,
      });
    }),
  getAvatarUrl: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return s3.getSignedUrl("getObject", {
        Bucket: BUCKET_NAME,
        Key: `avatars/${input.userId}`,
        Expires: FIFTEEN_MINUTES,
      });
    }),
});
