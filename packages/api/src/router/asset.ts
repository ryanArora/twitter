import { S3 } from "aws-sdk";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const FIFTEEN_MINUTES = 60 * 15;

export const assetRouter = createTRPCRouter({
  getUploadUrl: protectedProcedure
    .input(
      z.object({
        path: z.enum(["avatars", "banners"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (
        !process.env.AWS_ACCESS_KEY ||
        !process.env.AWS_SECRET_ACCESS_KEY ||
        !process.env.AWS_REGION
      ) {
        throw new Error("env");
      }

      const s3 = new S3({
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
        region: process.env.AWS_REGION,
      });

      return s3.getSignedUrl("putObject", {
        Bucket: "twitter.ryna.dev-assets",
        Key: `${input.path}/${ctx.session.user.id}`,
        Expires: FIFTEEN_MINUTES,
      });
    }),
});
