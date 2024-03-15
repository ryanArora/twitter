"use client";

import { Spinner } from "@repo/ui/components/spinner";
import { Fragment } from "react";
import { useInView } from "react-intersection-observer";
import { useProfile } from "../../profileContext";
import { FollowUser } from "../follow-user";
import { api } from "@/trpc/react";

export default function FollowersPage() {
  const profile = useProfile();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = api.follow.timelineFollowers.useInfiniteQuery(
    { userId: profile.id },
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

  const n = data.pages.reduce(
    (accum, curr) => accum + curr.followers.length,
    0,
  );

  if (n == 0) {
    return (
      <div className="flex justify-center pt-8">
        <div className="w-[300px]">
          <p className="mb-1 w-fit text-3xl font-bold">
            Looking for followers?
          </p>
          <p className="w-fit text-sm text-primary/50">
            When someone follows this account, they’ll show up here. Posting and
            interacting with others helps boost followers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {data.pages.map((group, i) => (
        <Fragment key={i}>
          {group.followers.map((user) => (
            <FollowUser key={user.id} user={user} />
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
}
