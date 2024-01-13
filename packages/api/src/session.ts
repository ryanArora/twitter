import { db } from "@repo/db";

export const getSession = async (token?: string) => {
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
    user: {
      id: session.user.id,
    },
  };
};

export type Session = NonNullable<Awaited<ReturnType<typeof getSession>>>;
