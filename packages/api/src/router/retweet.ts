import { db } from "@repo/db";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const retweetRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ tweetId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await db.retweet.create({
        data: {
          tweetId: input.tweetId,
          userId: ctx.session.user.id,
        },
        select: { tweetId: true }, // Need to select something...
      });
    }),
  delete: protectedProcedure
    .input(z.object({ tweetId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await db.retweet.delete({
        select: { tweetId: true }, // Need to select something...
        where: {
          userId_tweetId: {
            tweetId: input.tweetId,
            userId: ctx.session.user.id,
          },
        },
      });
    }),
});
