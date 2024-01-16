import { type User, db } from "@repo/db";
import { type ExpandRecursively, type Expand } from "@repo/types";

export type Session = Expand<
  { token: string; expires: Date } & ExpandRecursively<{
    user: Pick<User, "id" | "username" | "name" | "profilePictureUrl">;
  }>
>;

export const getSession = async (token?: string): Promise<Session | null> => {
  if (!token) return null;

  return await db.session.findUnique({
    where: {
      token,
      expires: {
        gt: new Date(Date.now()),
      },
    },
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
};
