"use client";

import { type FC } from "react";
import { type TweetBasic } from "../../../../../../../../packages/api/src/router/tweet";
import { PostTweet } from "../../home/post-tweet";
import { Timeline } from "../../timeline";
import { Tweet } from "../../tweet/tweet";
import { TweetProvider } from "../../tweet/tweetContext";
import { Header } from "@/app/(with-navbar)/header";
import { api } from "@/trpc/react";

export type PageClientProps = {
  tweet: TweetBasic;
};

export const PageClient: FC<PageClientProps> = ({ tweet: initialTweet }) => {
  const { data: tweet } = api.tweet.find.useQuery(
    {
      id: initialTweet.id,
      username: initialTweet.author.username,
    },
    {
      initialData: initialTweet,
    },
  );

  if (!tweet) {
    return null;
  }

  return (
    <div className="h-full min-h-screen border-x">
      <Header title="Tweet" />
      <TweetProvider tweet={tweet}>
        <Tweet big={true} />
      </TweetProvider>
      <div className="border-b">
        <PostTweet
          inputPlaceholder="Post your reply"
          submitButtonText="Reply"
          parentTweetId={tweet.id}
        />
      </div>
      <Timeline
        path="tweetReplies"
        payload={{ tweetReplies_parentId: tweet.id, profile_userId: "" }}
      />
    </div>
  );
};
