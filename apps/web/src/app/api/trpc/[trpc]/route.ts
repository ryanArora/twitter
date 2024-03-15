import { appRouter, createTRPCContext } from "@repo/api";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";
import { getSession } from "../../../../../../../packages/api/src/router/auth";

/**
 * This wraps the `createTRPCContext` helper and provides the required context
 * for the tRPC API when handling a HTTP request (e.g. when you make requests
 * from Client Components).
 */
const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
    session: await getSession(req.cookies.get("session-token")?.value),
  });
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    createContext: () => createContext(req),
    endpoint: "/api/trpc",
    onError: ({ error, path }) => {
      console.error(
        `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
      );
    },
    req,
    router: appRouter,
  });

export { handler as GET, handler as POST };
