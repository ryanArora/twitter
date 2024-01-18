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

  const like = api.like.create.useMutation({
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
      utils.tweet.timeline.setInfiniteData(
        { limit: 10 },
        context!.previousTweets,
      );
    },
  });

  const unlike = api.like.delete.useMutation({
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
                  likes: t._count.likes - 1,
                },
                likes: t.likes.filter((l) => l.user.id !== session.user.id),
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

  const liked = tweet.likes.some((l) => l.user.id === session.user.id);
  const likesCountFormatted = formatNumberShort(tweet._count.likes, 1);

  if (!liked) {
    return (
      <Button
        type="button"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          like.mutate({ tweetId: tweet.id });
        }}
      >
        <HeartIcon />
        <p>{likesCountFormatted}</p>
      </Button>
    );
  } else {
    return (
      <Button
        type="button"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          unlike.mutate({ tweetId: tweet.id });
        }}
      >
        <HeartIcon fill="red" color="red" />
        <p>{likesCountFormatted}</p>
      </Button>
    );
  }
};
