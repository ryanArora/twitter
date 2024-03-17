import { assetRouter } from "./router/asset";
import { authRouter } from "./router/auth";
import { bookmarkRouter } from "./router/bookmark";
import { followRouter } from "./router/follow";
import { likeRouter } from "./router/like";
import { retweetRouter } from "./router/retweet";
import { timelineRouter } from "./router/timeline";
import { tweetRouter } from "./router/tweet";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  asset: assetRouter,
  auth: authRouter,
  bookmark: bookmarkRouter,
  follow: followRouter,
  like: likeRouter,
  retweet: retweetRouter,
  timeline: timelineRouter,
  tweet: tweetRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
