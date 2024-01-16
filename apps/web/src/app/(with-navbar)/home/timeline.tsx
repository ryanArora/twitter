"use client";

import { Button } from "@repo/ui/components/button";
import { useToast } from "@repo/ui/components/use-toast";
import { formatNumberShort } from "@repo/utils/str";
import {
  BarChart2Icon,
  HeartIcon,
  MessageCircleIcon,
  Repeat2Icon,
} from "lucide-react";
import { type FC, Fragment } from "react";
import { UserAvatar } from "./user-avatar";
import { useSession } from "@/context/session";
import { api } from "@/trpc/react";

export const Tweet: FC<{
  tweet: {
    id: string;
    content: string;
    attachments: string[];
    author: {
      id: string;
      username: string;
      name: string;
      profilePictureUrl: string | null;
    };
    _count: {
      replies: number;
      retweets: number;
      likes: number;
      views: number;
    };
    likes: {
      user: {
        id: string;
        username: string;
        name: string;
        profilePictureUrl: string | null;
      };
      createdAt: Date;
    }[];
    retweets: {
      user: {
        id: string;
        username: string;
        name: string;
        profilePictureUrl: string | null;
      };
      createdAt: Date;
    }[];
  };
}> = ({ tweet }) => {
  const utils = api.useUtils();
  const like = api.tweet.like.useMutation();
  const dislike = api.tweet.dislike.useMutation();
  const { toast } = useToast();
  const session = useSession();

  const liked = tweet.likes.some((like) => like.user.id === session.user.id);

  function likeTweet() {
    like.mutate(
      {
        tweetId: tweet.id,
      },
      {
        onError: (err) => {
          toast({
            title: "Error",
            description: err.message,
          });
        },
        onSuccess: async () => {
          await utils.tweet.getTimeline.cancel();

          utils.tweet.getTimeline.setInfiniteData({ limit: 10 }, (data) => {
            if (!data) return;

            return {
              pages: data.pages.map((page) => ({
                ...page,
                tweets: page.tweets.map((t) => {
                  if (t.id !== tweet.id) return t;
                  return {
                    ...t,
                    _count: {
                      ...t._count,
                      likes: t._count.likes + 1,
                    },
                    likes: [
                      {
                        createdAt: new Date(Date.now()),
                        user: session.user,
                      },
                      ...t.likes,
                    ],
                  };
                }),
              })),
              pageParams: [],
            };
          });
        },
      },
    );
  }

  function dislikeTweet() {
    dislike.mutate(
      { tweetId: tweet.id },
      {
        onError: (err) => {
          toast({
            title: "Error",
            description: err.message,
          });
        },
        onSuccess: async () => {
          await utils.tweet.getTimeline.cancel();

          utils.tweet.getTimeline.setInfiniteData({ limit: 10 }, (data) => {
            if (!data) return;

            return {
              pages: data.pages.map((page) => ({
                ...page,
                tweets: page.tweets.map((t) => {
                  if (t.id !== tweet.id) return t;
                  return {
                    ...t,
                    _count: {
                      ...t._count,
                      likes: t._count.likes - 1,
                    },
                    likes: t.likes.filter(
                      (like) => like.user.id !== session.user.id,
                    ),
                  };
                }),
              })),
              pageParams: [],
            };
          });
        },
      },
    );
  }

  return (
    <div className="flex items-start border p-2">
      <UserAvatar className="hi m-2" user={tweet.author} />
      <div className="flex flex-col">
        <div className="w-fit">
          <span className="p-2">{tweet.author.name}</span>
          <span className="p-2">{`@${tweet.author.username}`}</span>
        </div>
        <div className="break-all w-fit">
          <p className="p-2">{tweet.content}</p>
        </div>
        <div>
          <Button variant="ghost">
            <MessageCircleIcon />
            <p>{formatNumberShort(tweet._count.replies, 1)}</p>
          </Button>
          <Button variant="ghost">
            <Repeat2Icon />
            <p>{formatNumberShort(tweet._count.retweets, 1)}</p>
          </Button>
          <Button
            variant="ghost"
            onClick={(e) => {
              e.preventDefault();

              if (!liked) {
                likeTweet();
              } else {
                dislikeTweet();
              }
            }}
          >
            <HeartIcon fill={liked ? "red" : undefined} />
            <p>{formatNumberShort(tweet._count.likes, 1)}</p>
          </Button>
          <Button variant="ghost">
            <BarChart2Icon />
            <p>{formatNumberShort(tweet._count.views, 1)}</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export const Timeline: FC = () => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = api.tweet.getTimeline.useInfiniteQuery(
    { limit: 10 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  return status === "pending" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      {data.pages.map((group, i) => (
        <Fragment key={i}>
          {group.tweets.map((tweet) => (
            <Tweet key={tweet.id} tweet={tweet} />
          ))}
        </Fragment>
      ))}
      <div>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
              ? "Load More"
              : "Nothing more to load"}
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
    </>
  );
};
