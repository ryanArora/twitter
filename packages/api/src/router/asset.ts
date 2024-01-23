import { getSignedUrl, postSignedUrl } from "@repo/aws";
import { db } from "@repo/db";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const assetRouter = createTRPCRouter({
  getPostUrl: protectedProcedure
    .input(z.object({ resource: z.enum(["avatars", "banners"]) }))
    .query(({ ctx, input }) => {
      return postSignedUrl(`${input.resource}/${ctx.session.user.id}`);
    }),
  getAvatarUrl: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      return getSignedUrl(`avatars/${input.userId}`);
    }),
  getBannerUrl: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      return getSignedUrl(`banners/${input.userId}`);
    }),
  createAttachment: protectedProcedure.mutation(async () => {
    const attachment = await db.attachment.create({
      data: {},
      select: { id: true },
    });

    return {
      attachmentId: attachment.id,
      presignedPost: postSignedUrl(`attachments/${attachment.id}`),
    };
  }),
  getAttachmentUrl: protectedProcedure
    .input(z.object({ attachmentId: z.string() }))
    .query(({ input }) => {
      return getSignedUrl(`attachments/${input.attachmentId}`);
    }),
});
