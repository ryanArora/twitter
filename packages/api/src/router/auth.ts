import { randomBytes } from "node:crypto";
import { db } from "@repo/db";
import { TRPCError } from "@trpc/server";
import argon2 from "argon2";
import { z } from "zod";
import { loginValidator, signupValidator } from "../schemas/auth";
import { type Session } from "../session";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

function createSession() {
  const session = {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 52),
    cancelled: false,
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
      });

      return {
        token: session.token,
        expires: session.expires,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
        },
      };
    }),
  login: publicProcedure
    .input(loginValidator)
    .mutation(async ({ input }): Promise<Session> => {
      const user = await db.user.findUnique({
        where: { username: input.username },
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

      const updatedUser = await db.user.update({
        where: { id: user.id },
        data: {
          sessions: {
            create: session,
          },
        },
      });

      return {
        token: session.token,
        expires: session.expires,
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          name: updatedUser.name,
        },
      };
    }),
  logout: protectedProcedure.input(z.null()).mutation(async ({ ctx }) => {
    await db.session.update({
      where: { token: ctx.session.token },
      data: {
        cancelled: true,
      },
    });
  }),
});
