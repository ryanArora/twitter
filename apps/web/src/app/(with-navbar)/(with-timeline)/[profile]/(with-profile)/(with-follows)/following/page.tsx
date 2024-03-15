"use client";

import { Spinner } from "@repo/ui/components/spinner";
import { Fragment } from "react";
import { useInView } from "react-intersection-observer";
import { useProfile } from "../../profileContext";
import { FollowUser } from "../follow-user";
import { api } from "@/trpc/react";

export default function FollowingPage() {
  const profile = useProfile();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = api.follow.timelineFollowing.useInfiniteQuery(
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

  return (
    <>
      {data.pages.map((group, i) => (
        <Fragment key={i}>
          {group.following.map((user) => (
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
