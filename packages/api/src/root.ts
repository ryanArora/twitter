import { authRouter } from "./router/auth";
import { likeRouter } from "./router/like";
import { retweetRouter } from "./router/retweet";
import { tweetRouter } from "./router/tweet";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  tweet: tweetRouter,
  like: likeRouter,
  retweet: retweetRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
