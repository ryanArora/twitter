import { db } from "@repo/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const followRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        profileId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.id === input.profileId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await db.follow.create({
        data: {
          followedId: input.profileId,
          followerId: ctx.session.user.id,
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        profileId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db.follow.delete({
        where: {
          followerId_followedId: {
            followedId: input.profileId,
            followerId: ctx.session.user.id,
          },
        },
      });
    }),
});
