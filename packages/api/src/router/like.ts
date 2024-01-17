import { db } from "@repo/db";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const likeRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ tweetId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await db.like.create({
        data: {
          userId: ctx.session.user.id,
          tweetId: input.tweetId,
        },
        select: { tweetId: true }, // Need to select something...
      });
    }),
  delete: protectedProcedure
    .input(z.object({ tweetId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await db.like.delete({
        where: {
          userId_tweetId: {
            userId: ctx.session.user.id,
            tweetId: input.tweetId,
          },
        },
        select: { tweetId: true }, // Need to select something...
      });
    }),
});
