"use client";

import { sleep } from "@repo/utils/sleep";
import { useQueryClient } from "@tanstack/react-query";
import { BookmarkIcon } from "lucide-react";
import { type FC } from "react";
import { type TweetBasic } from "../../../../../../../../packages/api/src/router/tweet";
import { useTweet } from "../tweetContext";
import { useSession } from "@/app/sessionContext";
import { api } from "@/trpc/react";

type TimelineInfiniteData = { pages: { tweets: TweetBasic[] }[] };

type BookmarkInteractionProps = {
  onMutate: () => void;
};

export const BookmarkInteraction: FC<BookmarkInteractionProps> = ({
  onMutate,
}) => {
  const tweet = useTweet();
  const session = useSession();
  const utils = api.useUtils();
  const queryClient = useQueryClient();

  const queryCache = queryClient.getQueryCache();
  const timelineQueryKeys = queryCache
    .getAll()
    .map((cache) => cache.queryKey)
    .filter((queryKey) => {
      const endpoint = queryKey[0] as string[];
      return endpoint[0] === "timeline";
    });

  const bookmarkMutation = api.bookmark.create.useMutation({
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
        (t) => {
          if (!t) return;
          return {
            ...t,
            bookmarks: [
              {
                createdAt: new Date(Date.now()),
                user: session.user,
              },
              ...t.bookmarks,
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
        const endpoint = queryKey[0] as string[];
        if (endpoint[1] === "bookmarks") {
          queryClient.setQueryData(queryKey, (data: TimelineInfiniteData) => {
            if (!data) return;
            return {
              pageParams: [],
              pages: [
                {
                  tweets: [
                    {
                      ...tweet,
                      bookmarks: [
                        {
                          createdAt: new Date(Date.now()),
                          user: session.user,
                        },
                        ...tweet.bookmarks,
                      ],
                    },
                  ],
                },
                ...data.pages,
              ],
            };
          });
          continue;
        }

        queryClient.setQueryData(queryKey, (data: TimelineInfiniteData) => {
          if (!data) return;
          return {
            pageParams: [],
            pages: data.pages.map((page) => ({
              ...page,
              tweets: page.tweets.map((t) => {
                if (t.id !== t.id) return t;
                return {
                  ...t,
                  bookmarks: [
                    {
                      createdAt: new Date(Date.now()),
                      user: session.user,
                    },
                    ...t.bookmarks,
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

  const unbookmarkMutation = api.bookmark.delete.useMutation({
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
      onMutate();
      await sleep(1000);

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
        (t) => {
          if (!t) return;
          return {
            ...t,
            bookmarks: t.bookmarks.filter((b) => b.user.id !== session.user.id),
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
        const endpoint = queryKey[0] as string[];
        if (endpoint[1] === "bookmarks") {
          queryClient.setQueryData(queryKey, (data: TimelineInfiniteData) => {
            if (!data) return;
            return {
              pageParams: [],
              pages: data.pages.map((page) => ({
                ...page,
                tweets: page.tweets.filter((t) => t.id != tweet.id),
              })),
            };
          });
          continue;
        }

        queryClient.setQueryData(queryKey, (data: TimelineInfiniteData) => {
          if (!data) return;
          return {
            pageParams: [],
            pages: data.pages.map((page) => ({
              ...page,
              tweets: page.tweets.map((t) => {
                if (t.id !== t.id) return t;
                return {
                  ...t,
                  bookmarks: t.bookmarks.filter(
                    (b) => b.user.id !== session.user.id,
                  ),
                };
              }),
            })),
          };
        });
      }

      return { previousTimelines, previousTweet };
    },
  });

  const active = tweet.bookmarks.some(
    (bookmark) => bookmark.user.id === session.user.id,
  );

  return (
    <button
      className="flex w-full items-center p-2 hover:cursor-pointer hover:bg-primary/10"
      onClick={async (e) => {
        e.stopPropagation();

        onMutate();
        await sleep(500);

        if (active) {
          unbookmarkMutation.mutate({ tweetId: tweet.id });
        } else {
          bookmarkMutation.mutate({ tweetId: tweet.id });
        }
      }}
      type="button"
    >
      <BookmarkIcon className="mr-1 p-[2px]" />
      <span className="text-sm font-semibold">
        {active ? "Unbookmark tweet" : "Bookmark tweet"}
      </span>
    </button>
  );
};
