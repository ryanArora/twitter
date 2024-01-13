import { appRouter, createTRPCContext, getSession } from "@repo/api";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

/**
 * This wraps the `createTRPCContext` helper and provides the required context
 * for the tRPC API when handling a HTTP request (e.g. when you make requests
 * from Client Components).
 */
const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    session: await getSession(req.cookies.get("session-token")?.value),
    headers: req.headers,
  });
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError: ({ path, error }) => {
      console.error(
        `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
      );
    },
  });

export { handler as GET, handler as POST };
