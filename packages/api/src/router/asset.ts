import { getSignedUrl, postSignedUrl } from "@repo/aws";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const assetRouter = createTRPCRouter({
  getPostUrl: protectedProcedure
    .input(
      z.object({
        resource: z.enum(["avatars", "banners"]),
      }),
    )
    .query(({ ctx, input }) => {
      return postSignedUrl(`${input.resource}/${ctx.session.user.id}`);
    }),
  getAvatarUrl: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(({ input }) => {
      return getSignedUrl(`avatars/${input.userId}`);
    }),
  getBannerUrl: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(({ input }) => {
      return getSignedUrl(`banners/${input.userId}`);
    }),
});
