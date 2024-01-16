"use client";

import { type Session } from "@repo/api/session";
import { type ReactNode, createContext, useContext } from "react";

export const SessionContext = createContext<Session | null>(null);

export function SessionProvider({
  session,
  children,
}: {
  session: Session | null;
  children: ReactNode;
}) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): Session {
  const session = useContext(SessionContext);

  if (!session) {
    window.location.replace("/");
    return {
      token: "",
      expires: new Date(Date.now()),
      user: {
        id: "",
        name: "Loading User",
        username: "loading",
        profilePictureUrl: null,
      },
    };
  }

  return session!;
}
