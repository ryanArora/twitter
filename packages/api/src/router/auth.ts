import { randomBytes } from "node:crypto";
import { db } from "@repo/db";
import { type Expand } from "@repo/utils/types";
import { TRPCError } from "@trpc/server";
import argon2 from "argon2";
import { z } from "zod";
import { loginValidator, signupValidator } from "../schemas/auth";
import { type Session } from "../session";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

function createSession(): Expand<Omit<Session, "user">> {
  const session = {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 52),
    token: randomBytes(128).toString("base64"),
  };

  return session;
}

export const authRouter = createTRPCRouter({
  getSession: publicProcedure.query(({ ctx }): Session | null => {
    return ctx.session;
  }),
  signup: publicProcedure
    .input(signupValidator)
    .mutation(async ({ input }): Promise<Session> => {
      const session = createSession();

      const user = await db.user.create({
        data: {
          username: input.username,
          name: input.name,
          passwordHash: await argon2.hash(input.password),
          sessions: {
            create: session,
          },
        },
        select: {
          id: true,
          username: true,
          name: true,
          profilePictureUrl: true,
        },
      });

      return {
        ...session,
        user,
      };
    }),
  login: publicProcedure
    .input(loginValidator)
    .mutation(async ({ input }): Promise<Session> => {
      const user = await db.user.findUnique({
        where: { username: input.username },
        select: {
          id: true,
          passwordHash: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const match = await argon2.verify(user.passwordHash, input.password);
      if (!match) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const session = createSession();

      return await db.session.create({
        data: { ...session, userId: user.id },
        select: {
          token: true,
          expires: true,
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              profilePictureUrl: true,
            },
          },
        },
      });
    }),
  logout: protectedProcedure.input(z.null()).mutation(async ({ ctx }) => {
    await db.session.delete({
      where: { token: ctx.session.token },
    });
  }),
});
