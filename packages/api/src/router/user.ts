import { type Prisma, db } from "@repo/db";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const selectUserBasic = {
  id: true,
  name: true,
  username: true,
  profilePictureUrl: true,
} satisfies Prisma.UserSelect;

export const selectUserProfile = {
  ...selectUserBasic,
  bannerUrl: true,
  createdAt: true,
  _count: {
    select: {
      tweets: true,
      followers: true,
      following: true,
    },
  },
} satisfies Prisma.UserSelect;

export const userRouter = createTRPCRouter({
  find: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      return await db.user.findUnique({
        where: {
          usernameLower: input.username.toLowerCase(),
        },
        select: selectUserProfile,
      });
    }),
});
