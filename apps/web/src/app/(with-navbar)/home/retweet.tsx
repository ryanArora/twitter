import { Button } from "@repo/ui/components/button";
import { formatNumberShort } from "@repo/utils/str";
import { Repeat2Icon } from "lucide-react";
import { type FC } from "react";
import { type TweetProps } from "./tweet";
import { useSession } from "@/context/session";
import { api } from "@/trpc/react";

export const Retweet: FC<{ tweet: TweetProps["tweet"] }> = ({ tweet }) => {
  const utils = api.useUtils();
  const session = useSession();

  const retweet = api.retweet.create.useMutation({
    onMutate: async () => {
      await utils.tweet.timeline.cancel();
      const previousTweets = utils.tweet.timeline.getInfiniteData();

      utils.tweet.timeline.setInfiniteData({ limit: 10 }, (data) => {
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
      });

      return { previousTweets };
    },
    onError: (err, input, context) => {
      utils.tweet.timeline.setInfiniteData(
        { limit: 10 },
        context!.previousTweets,
      );
    },
  });

  const unretweet = api.retweet.delete.useMutation({
    onMutate: async () => {
      await utils.tweet.timeline.cancel();
      const previousTweets = utils.tweet.timeline.getInfiniteData();

      utils.tweet.timeline.setInfiniteData({ limit: 10 }, (data) => {
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
      });

      return { previousTweets };
    },
    onError: (err, input, context) => {
      utils.tweet.timeline.setInfiniteData(
        { limit: 10 },
        context!.previousTweets,
      );
    },
  });

  const retweeted = tweet.retweets.some((rt) => rt.user.id === session.user.id);
  const retweetsCountFormatted = formatNumberShort(tweet._count.retweets, 1);

  if (!retweeted) {
    return (
      <Button
        type="button"
        variant="ghost"
        onClick={() => {
          retweet.mutate({ tweetId: tweet.id });
        }}
      >
        <Repeat2Icon />
        <p>{retweetsCountFormatted}</p>
      </Button>
    );
  } else {
    return (
      <Button
        type="button"
        variant="ghost"
        onClick={() => {
          unretweet.mutate({ tweetId: tweet.id });
        }}
      >
        <Repeat2Icon color="lime" />
        <p>{retweetsCountFormatted}</p>
      </Button>
    );
  }
};
