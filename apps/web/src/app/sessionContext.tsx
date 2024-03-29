"use client";

import { type RouterOutputs } from "@repo/api";
import { useRouter } from "next/navigation";
import { type ReactNode, createContext, useContext } from "react";
import { api } from "@/trpc/react";

export type Session = NonNullable<RouterOutputs["auth"]["getSession"]>;

export const SessionContext = createContext<Session | null>(null);

export function SessionProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
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
  const router = useRouter();

  if (!session) {
    router.replace("/");
  }

  return session!;
}
