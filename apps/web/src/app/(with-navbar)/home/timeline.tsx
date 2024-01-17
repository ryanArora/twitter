"use client";

import { Button } from "@repo/ui/components/button";
import { type FC, Fragment } from "react";
import ClipLoader from "react-spinners/ClipLoader";
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

  if (status === "pending") {
    return (
      <div className="flex justify-center m-2">
        <ClipLoader color="white" size={20} />
      </div>
    );
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
      <div className="flex justify-center m-2">
        {isFetchingNextPage ? (
          <ClipLoader color="white" size={20} />
        ) : (
          <Button onClick={() => fetchNextPage()} disabled={!hasNextPage}>
            {hasNextPage ? "Load More" : "Nothing more to load"}
          </Button>
        )}
      </div>
    </>
  );
};
