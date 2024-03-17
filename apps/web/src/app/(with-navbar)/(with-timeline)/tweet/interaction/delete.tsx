"use client";

import { useToast } from "@repo/ui/components/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { type FC } from "react";
import { type TweetBasic } from "../../../../../../../../packages/api/src/router/tweet";
import { useTweet } from "../tweetContext";
import { api } from "@/trpc/react";

type TimelineInfiniteData = { pages: { tweets: TweetBasic[] }[] };

export const DeleteInteraction: FC = () => {
  const tweet = useTweet();
  const { toast } = useToast();
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

  const deleteTweet = api.tweet.delete.useMutation({
    onError: () => {
      toast({
        description: "Error deleting tweet.",
        title: "Error",
      });
    },
    onSuccess: () => {
      utils.tweet.find.setData(
        { id: tweet.id, username: tweet.author.username },
        () => {
          return null;
        },
      );

      for (const queryKey of timelineQueryKeys) {
        queryClient.setQueryData(queryKey, (data: TimelineInfiniteData) => {
          if (!data) return;
          return {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              tweets: page.tweets.filter((t) => t.id !== tweet.id),
            })),
          };
        });
      }
    },
  });

  return (
    <button
      className="flex h-full w-full items-center p-2 text-red-500 hover:cursor-pointer hover:bg-primary/10"
      onClick={(e) => {
        e.stopPropagation();
        deleteTweet.mutate({ id: tweet.id });
      }}
      type="button"
    >
      <Trash2Icon className="mr-1 p-[2px]" />
      <span className="text-sm font-semibold">Delete</span>
    </button>
  );
};
