import { Button } from "@repo/ui/components/button";
import { formatNumberShort } from "@repo/utils/str";
import { HeartIcon } from "lucide-react";
import { type FC } from "react";
import { type TweetProps } from "./tweet";
import { useSession } from "@/context/session";
import { api } from "@/trpc/react";

export const Like: FC<{ tweet: TweetProps["tweet"] }> = ({ tweet }) => {
  const session = useSession();
  const utils = api.useUtils();

  const like = api.tweet.like.useMutation({
    onMutate: async () => {
      await utils.tweet.getTimeline.cancel();
      const previousTweets = utils.tweet.getTimeline.getInfiniteData();

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

      return { previousTweets };
    },
    onError: (err, input, context) => {
      utils.tweet.getTimeline.setInfiniteData(
        { limit: 10 },
        context!.previousTweets,
      );
    },
  });

  const dislike = api.tweet.dislike.useMutation({
    onMutate: async () => {
      await utils.tweet.getTimeline.cancel();
      const previousTweets = utils.tweet.getTimeline.getInfiniteData();

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

      return { previousTweets };
    },
    onError: (err, input, context) => {
      utils.tweet.getTimeline.setInfiniteData(
        { limit: 10 },
        context!.previousTweets,
      );
    },
  });

  const liked = tweet.likes.some((like) => like.user.id === session.user.id);

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => {
        if (!liked) {
          like.mutate({ tweetId: tweet.id });
        } else {
          dislike.mutate({ tweetId: tweet.id });
        }
      }}
    >
      <HeartIcon fill={liked ? "red" : undefined} />
      <p>{formatNumberShort(tweet._count.likes, 1)}</p>
    </Button>
  );
};
