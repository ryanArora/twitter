"use client";

import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/utils";
import { formatNumberShort } from "@repo/utils/str";
import { Repeat2Icon } from "lucide-react";
import React, { forwardRef } from "react";
import { useSession } from "../../../../sessionContext";
import { useTimelineSource } from "../../timelineSourceContext";
import { useTweet } from "../tweetContext";
import { api } from "@/trpc/react";

export type RetweetInteractionProps = Record<string, unknown>;

export const RetweetInteraction = forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & RetweetInteractionProps
>(({ className, ...props }, ref) => {
  const session = useSession();
  const tweet = useTweet();
  const timelineSource = useTimelineSource();
  const utils = api.useUtils();

  const retweetMutation = api.retweet.create.useMutation({
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
                    retweets: t._count.retweets + 1,
                  },
                  retweets: [
                    {
                      createdAt: new Date(Date.now()),
                      user: session.user,
                    },
                    ...t.retweets,
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

  const unretweetMutation = api.retweet.delete.useMutation({
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
                    retweets: t._count.retweets - 1,
                  },
                  retweets: t.retweets.filter(
                    (rt) => rt.user.id !== session.user.id,
                  ),
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

  const active = tweet.retweets.some((rt) => rt.user.id === session.user.id);

  return (
    <Button
      {...props}
      ref={ref}
      className={cn(
        `m-0 p-2 rounded-full hover:text-twitter-retweet hover:bg-twitter-retweet/10 transition-colors`,
        active ? "text-twitter-retweet" : null,
        className,
      )}
      type="button"
      variant="ghost"
      onClick={(e) => {
        e.stopPropagation();

        if (active) {
          unretweetMutation.mutate({ tweetId: tweet.id });
        } else {
          retweetMutation.mutate({ tweetId: tweet.id });
        }
      }}
    >
      <Repeat2Icon />
      <p className="ml-1">{formatNumberShort(tweet._count.retweets, 1)}</p>
    </Button>
  );
});
RetweetInteraction.displayName = Button.displayName;
