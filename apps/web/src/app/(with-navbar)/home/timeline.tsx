"use client";

import { Spinner } from "@repo/ui/components/spinner";
import { type FC, Fragment } from "react";
import { useInView } from "react-intersection-observer";
import { Tweet } from "./tweet";
import { api } from "@/trpc/react";

export const Timeline: FC = () => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = api.tweet.timeline.useInfiniteQuery(
    { limit: 10 },
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
            <Tweet key={tweet.id} tweet={tweet} />
          ))}
        </Fragment>
      ))}
      {hasNextPage && <Spinner ref={ref} />}
    </>
  );
};
