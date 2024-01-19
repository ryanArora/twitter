"use client";

import { Spinner } from "@repo/ui/components/spinner";
import { type FC, Fragment } from "react";
import { useInView } from "react-intersection-observer";
import { useTimelineSource } from "./timelineSourceContext";
import { Tweet } from "./tweet/tweet";
import { TweetProvider } from "./tweet/tweetContext";
import { api } from "@/trpc/react";

export const Timeline: FC = () => {
  const timelineSource = useTimelineSource();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = api.timeline[timelineSource].useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const { ref, inView } = useInView();

  if (inView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  if (status === "pending") {
    return <Spinner />;
  }

  if (status === "error") {
    return <p>Error: {error.message}</p>;
  }

  return (
    <>
      {data.pages.map((group, i) => (
        <Fragment key={i}>
          {group.tweets.map((tweet) => (
            <TweetProvider tweet={tweet} key={tweet.id}>
              <Tweet />
            </TweetProvider>
          ))}
        </Fragment>
      ))}
      {hasNextPage && <Spinner ref={ref} />}
    </>
  );
};
