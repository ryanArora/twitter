import { type User, db } from "@repo/db";
import { type ExpandRecursively, type Expand } from "@repo/types";

export type Session = Expand<
  { token: string; expires: Date } & ExpandRecursively<{
    user: Pick<User, "id" | "username" | "name" | "profilePictureUrl">;
  }>
>;

export const getSession = async (token?: string): Promise<Session | null> => {
  if (!token) return null;

  const session = await db.session.findUnique({
    where: {
      token,
    },
    include: {
      user: true,
    },
  });

  if (!session) return null;
  if (session.cancelled) return null;
  if (session.expires < new Date(Date.now())) return null;

  return {
    token: session.token,
    expires: session.expires,
    user: {
      id: session.user.id,
      username: session.user.username,
      name: session.user.name,
      profilePictureUrl: session.user.profilePictureUrl,
    },
  };
};
