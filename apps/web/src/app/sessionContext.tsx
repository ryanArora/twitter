"use client";

import { type Session } from "@repo/api/session";
import { type ReactNode, createContext, useContext } from "react";
import { api } from "@/trpc/react";

export const SessionContext = createContext<Session | null>(null);

export function SessionProvider({
  session,
  children,
}: {
  session: Session | null;
  children: ReactNode;
}) {
  const { data } = api.auth.getSession.useQuery(undefined, {
    initialData: session,
  });

  return (
    <SessionContext.Provider value={data}>{children}</SessionContext.Provider>
  );
}

export function useSession(): Session {
  const session = useContext(SessionContext);

  if (!session) {
    throw new Error("No session");
  }

  return session!;
}