import { type User, db } from "@repo/db";
import { type ExpandRecursively, type Expand } from "@repo/utils/types";
import { selectUserBasic } from "./router/user";

export type Session = Expand<
  { token: string; expires: Date } & ExpandRecursively<{
    user: Pick<User, "id" | "username" | "name">;
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
        select: selectUserBasic,
      },
    },
  });
};
