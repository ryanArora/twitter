"use client";

import { type RouterInputs } from "@repo/api";
import { Spinner } from "@repo/ui/components/spinner";
import { type FC, Fragment } from "react";
import { useInView } from "react-intersection-observer";
import { Tweet } from "./tweet/tweet";
import { TweetProvider } from "./tweet/tweetContext";
import { type TimelineInput } from "../../../../../../packages/api/src/router/timeline";
import { api } from "@/trpc/react";

export type TimelineSourceProps = {
  path: keyof RouterInputs["timeline"];
  payload: TimelineInput;
};

export const Timeline: FC<TimelineSourceProps> = ({ path, payload }) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = api.timeline[path].useInfiniteQuery(
    { ...payload },
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
      {hasNextPage ? (
        <Spinner ref={ref} />
      ) : (
        <div className="flex h-screen flex-col items-center justify-end">
          <p className="p-4 italic">fin.</p>
        </div>
      )}
    </>
  );
};
