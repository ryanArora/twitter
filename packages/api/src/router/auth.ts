import { randomBytes } from "node:crypto";
import { type User, db } from "@repo/db";
import { type Expand, type ExpandRecursively } from "@repo/utils/types";
import { TRPCError } from "@trpc/server";
import argon2 from "argon2";
import { z } from "zod";
import { getUserWithAvatarUrl } from "./asset";
import { selectUserBasic } from "./user";
import { loginSchema, signupSchema } from "../schemas/auth";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export type SessionWithoutAvatarUrl = Expand<
  { expires: Date; token: string } & ExpandRecursively<{
    user: Pick<User, "id" | "name" | "username">;
  }>
>;

export type Session = Omit<SessionWithoutAvatarUrl, "user"> & {
  user: SessionWithoutAvatarUrl["user"] & { avatarUrl: string };
};

export const getSession = async (token?: string): Promise<Session | null> => {
  if (!token) return null;

  const session = await db.session.findUnique({
    select: {
      expires: true,
      token: true,
      user: {
        select: selectUserBasic,
      },
    },
    where: {
      expires: {
        gt: new Date(Date.now()),
      },
      token,
    },
  });

  if (!session) return null;

  return {
    ...session,
    user: getUserWithAvatarUrl(session.user),
  };
};

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
  login: publicProcedure
    .input(loginSchema)
    .mutation(async ({ input }): Promise<Session> => {
      const user = await db.user.findUnique({
        select: {
          id: true,
          passwordHash: true,
        },
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

      const sessionWithoutUser = createSession();

      const session = await db.session.create({
        data: { ...sessionWithoutUser, userId: user.id },
        select: {
          expires: true,
          token: true,
          user: {
            select: selectUserBasic,
          },
        },
      });

      return {
        ...session,
        user: getUserWithAvatarUrl(session.user),
      };
    }),
  logout: protectedProcedure.input(z.null()).mutation(async ({ ctx }) => {
    await db.session.delete({
      where: { token: ctx.session.token },
    });
  }),
  signup: publicProcedure
    .input(signupSchema)
    .mutation(async ({ input }): Promise<Session> => {
      const session = createSession();

      const user = await db.user.create({
        data: {
          name: input.name,
          passwordHash: await argon2.hash(input.password),
          sessions: {
            create: session,
          },
          username: input.username,
          usernameLower: input.username.toLowerCase(),
        },
        select: selectUserBasic,
      });

      return {
        ...session,
        user: getUserWithAvatarUrl(user),
      };
    }),
});
