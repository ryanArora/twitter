import { getSignedUrl } from "@repo/aws";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const assetRouter = createTRPCRouter({
  getPutUrl: protectedProcedure
    .input(
      z.object({
        resource: z.enum(["avatars", "banners"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      return getSignedUrl("putObject", input.resource, ctx.session.user.id);
    }),
  getAvatarUrl: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return getSignedUrl("getObject", "avatars", input.userId);
    }),
  getBannerUrl: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return getSignedUrl("getObject", "banners", input.userId);
    }),
});
