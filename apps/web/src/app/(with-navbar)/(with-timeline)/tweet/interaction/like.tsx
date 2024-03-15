"use client";

import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/utils";
import { formatNumberShort } from "@repo/utils/str";
import { useQueryClient } from "@tanstack/react-query";
import { HeartIcon } from "lucide-react";
import React, { forwardRef } from "react";
import { type TweetBasic } from "../../../../../../../../packages/api/src/router/tweet";
import { useSession } from "../../../../sessionContext";
import { useTweet } from "../tweetContext";
import { api } from "@/trpc/react";

type TimelineInfiniteData = { pages: { tweets: TweetBasic[] }[] };

export type LikeInteractionProps = Record<string, unknown>;

export const LikeInteraction = forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & LikeInteractionProps
>(({ className, ...props }, ref) => {
  const session = useSession();
  const tweet = useTweet();
  const queryClient = useQueryClient();
  const utils = api.useUtils();

  const queryCache = queryClient.getQueryCache();
  const timelineQueryKeys = queryCache
    .getAll()
    .map((cache) => cache.queryKey)
    .filter((queryKey) => {
      const endpoint = queryKey[0] as string[];
      return endpoint[0] === "timeline";
    });

  const likeMutation = api.like.create.useMutation({
    onError: (err, input, ctx) => {
      utils.tweet.find.setData(
        { id: tweet.id, username: tweet.author.username },
        ctx!.previousTweet,
      );

      for (const queryKey of timelineQueryKeys) {
        queryClient.setQueryData(queryKey, ctx!.previousTimelines);
      }
    },
    onMutate: async () => {
      await utils.tweet.find.cancel({
        id: tweet.id,
        username: tweet.author.username,
      });

      const previousTweet = utils.tweet.find.getData();

      utils.tweet.find.setData(
        {
          id: tweet.id,
          username: tweet.author.username,
        },
        (tweet) => {
          if (!tweet) return;
          return {
            ...tweet,
            _count: {
              ...tweet._count,
              likes: tweet._count.likes + 1,
            },
            likes: [
              {
                createdAt: new Date(Date.now()),
                user: session.user,
              },
              ...tweet.likes,
            ],
          };
        },
      );

      for (const queryKey of timelineQueryKeys) {
        await queryClient.cancelQueries({ queryKey });
      }

      const previousTimelines = timelineQueryKeys.map((queryKey) =>
        queryClient.getQueryData(queryKey),
      ) as unknown as TimelineInfiniteData;

      for (const queryKey of timelineQueryKeys) {
        queryClient.setQueryData(queryKey, (data: TimelineInfiniteData) => {
          if (!data) return;
          return {
            pageParams: [],
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
          };
        });
      }

      return { previousTimelines, previousTweet };
    },
  });

  const unlikeMutation = api.like.delete.useMutation({
    onError: (err, input, ctx) => {
      utils.tweet.find.setData(
        { id: tweet.id, username: tweet.author.username },
        ctx!.previousTweet,
      );

      for (const queryKey of timelineQueryKeys) {
        queryClient.setQueryData(queryKey, ctx!.previousTimelines);
      }
    },
    onMutate: async () => {
      await utils.tweet.find.cancel({
        id: tweet.id,
        username: tweet.author.username,
      });

      const previousTweet = utils.tweet.find.getData();

      utils.tweet.find.setData(
        {
          id: tweet.id,
          username: tweet.author.username,
        },
        (tweet) => {
          if (!tweet) return;
          return {
            ...tweet,
            _count: {
              ...tweet._count,
              likes: tweet._count.likes - 1,
            },
            likes: tweet.likes.filter((l) => l.user.id !== session.user.id),
          };
        },
      );

      for (const queryKey of timelineQueryKeys) {
        await queryClient.cancelQueries({ queryKey });
      }

      const previousTimelines = timelineQueryKeys.map((queryKey) =>
        queryClient.getQueryData(queryKey),
      ) as unknown as TimelineInfiniteData;

      for (const queryKey of timelineQueryKeys) {
        queryClient.setQueryData(queryKey, (data: TimelineInfiniteData) => {
          if (!data) return;

          return {
            pageParams: [],
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
                  likes: t.likes.filter((l) => l.user.id !== session.user.id),
                };
              }),
            })),
          };
        });
      }

      return { previousTimelines, previousTweet };
    },
  });

  const active = tweet.likes.some((like) => like.user.id === session.user.id);

  return (
    <Button
      {...props}
      className={cn(
        `m-0 rounded-full p-2 text-primary/50 transition-colors hover:bg-twitter-like/10 hover:text-twitter-like`,
        active ? "text-twitter-like" : null,
        className,
      )}
      onClick={(e) => {
        e.stopPropagation();

        if (active) {
          unlikeMutation.mutate({ tweetId: tweet.id });
        } else {
          likeMutation.mutate({ tweetId: tweet.id });
        }
      }}
      ref={ref}
      type="button"
      variant="ghost"
    >
      <HeartIcon className={active ? "fill-twitter-like" : undefined} />
      <p className="ml-1">{formatNumberShort(tweet._count.likes, 1)}</p>
    </Button>
  );
});
LikeInteraction.displayName = Button.displayName;
