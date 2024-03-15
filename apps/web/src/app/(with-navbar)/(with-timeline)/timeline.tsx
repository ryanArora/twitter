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
  noTweetsMeta: {
    description: string;
    title: string;
  };
  path: keyof RouterInputs["timeline"];
  payload: TimelineInput;
};

export const Timeline: FC<TimelineSourceProps> = ({
  noTweetsMeta,
  path,
  payload,
}) => {
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

  const { inView, ref } = useInView();

  if (inView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  if (status === "pending") {
    return <Spinner />;
  }

  if (status === "error") {
    return <p>Error: {error.message}</p>;
  }

  const n = data.pages.reduce((accum, curr) => accum + curr.tweets.length, 0);

  if (n == 0) {
    return (
      <div className="flex justify-center pt-8">
        <div className="w-[300px]">
          <p className="mb-1 w-fit text-3xl font-bold">{noTweetsMeta.title}</p>
          <p className="w-fit text-sm text-primary/50">
            {noTweetsMeta.description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {data.pages.map((group, i) => (
        <Fragment key={i}>
          {group.tweets.map((tweet) => (
            <TweetProvider key={tweet.id} tweet={tweet}>
              <Tweet />
            </TweetProvider>
          ))}
        </Fragment>
      ))}
      {hasNextPage ? (
        <Spinner ref={ref} />
      ) : (
        <div className="flex h-screen flex-col items-center justify-end"></div>
      )}
    </>
  );
};
