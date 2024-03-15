"use client";

import { type ReactNode, createContext, useContext } from "react";
import { type TweetBasic } from "../../../../../../../packages/api/src/router/tweet";

export const TweetContext = createContext<TweetBasic | null>(null);

export function TweetProvider({
  children,
  tweet,
}: {
  children: ReactNode;
  tweet: TweetBasic | null;
}) {
  return (
    <TweetContext.Provider value={tweet}>{children}</TweetContext.Provider>
  );
}

export function useTweet(): TweetBasic {
  const tweet = useContext(TweetContext);

  if (!tweet) {
    throw Error("No tweet");
  }

  return tweet;
}
