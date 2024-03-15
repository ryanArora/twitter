import { createCaller, createTRPCContext } from "@repo/api";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import { getSession } from "../../../../packages/api/src/router/auth";

/**
 * This wraps the `createTRPCContext` helper and provides the required context
 * for the tRPC API when handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
    session: await getSession(cookies().get("session-token")?.value),
  });
});

export const api = createCaller(createContext);
