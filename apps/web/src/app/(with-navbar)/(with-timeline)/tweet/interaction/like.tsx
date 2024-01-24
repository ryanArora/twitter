"use client";

import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/utils";
import { formatNumberShort } from "@repo/utils/str";
import { HeartIcon } from "lucide-react";
import React, { forwardRef } from "react";
import { useSession } from "../../../../sessionContext";
import { useTimelineSource } from "../../timelineSourceContext";
import { useTweet } from "../tweetContext";
import { api } from "@/trpc/react";

export type LikeInteractionProps = Record<string, unknown>;

export const LikeInteraction = forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & LikeInteractionProps
>(({ className, ...props }, ref) => {
  const session = useSession();
  const tweet = useTweet();
  const timelineSource = useTimelineSource();
  const utils = api.useUtils();

  const likeMutation = api.like.create.useMutation({
    onMutate: async () => {
      await utils.timeline[timelineSource.path].cancel();
      const previousTweets =
        utils.timeline[timelineSource.path].getInfiniteData();

      utils.timeline[timelineSource.path].setInfiniteData(
        { ...timelineSource.payload },
        (data) => {
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
        },
      );

      return { previousTweets };
    },
    onError: (err, input, context) => {
      utils.timeline[timelineSource.path].setInfiniteData(
        { ...timelineSource.payload },
        context!.previousTweets,
      );
    },
  });

  const unlikeMutation = api.like.delete.useMutation({
    onMutate: async () => {
      await utils.timeline[timelineSource.path].cancel();
      const previousTweets =
        utils.timeline[timelineSource.path].getInfiniteData();

      utils.timeline[timelineSource.path].setInfiniteData(
        { ...timelineSource.payload },
        (data) => {
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
                  likes: t.likes.filter((l) => l.user.id !== session.user.id),
                };
              }),
            })),
            pageParams: [],
          };
        },
      );

      return { previousTweets };
    },
    onError: (err, input, context) => {
      utils.timeline[timelineSource.path].setInfiniteData(
        { ...timelineSource.payload },
        context!.previousTweets,
      );
    },
  });

  const active = tweet.likes.some((like) => like.user.id === session.user.id);

  return (
    <Button
      {...props}
      ref={ref}
      className={cn(
        `m-0 p-2 rounded-full hover:text-twitter-like hover:bg-twitter-like/10 transition-colors`,
        active ? "text-twitter-like" : null,
        className,
      )}
      type="button"
      variant="ghost"
      onClick={(e) => {
        e.stopPropagation();

        if (active) {
          unlikeMutation.mutate({ tweetId: tweet.id });
        } else {
          likeMutation.mutate({ tweetId: tweet.id });
        }
      }}
    >
      <HeartIcon className={active ? "fill-twitter-like" : undefined} />
      <p className="ml-1">{formatNumberShort(tweet._count.likes, 1)}</p>
    </Button>
  );
});
LikeInteraction.displayName = Button.displayName;
