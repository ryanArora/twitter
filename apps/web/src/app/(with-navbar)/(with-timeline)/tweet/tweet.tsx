"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { toast } from "@repo/ui/components/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { MoreHorizontalIcon, Trash2Icon, UserPlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FC } from "react";
import { LikeInteraction } from "./interaction/like";
import { ReplyInteraction } from "./interaction/reply";
import { RetweetInteraction } from "./interaction/retweet";
import { ViewsInteraction } from "./interaction/views";
import { useTweet } from "./tweetContext";
import { type TweetBasic } from "../../../../../../../packages/api/src/router/tweet";
import { UserAvatar } from "../../user-avatar";
import { AttachmentsView } from "../home/attatchments-view";
import { useSession } from "@/app/sessionContext";
import { api } from "@/trpc/react";

type TimelineInfiniteData = { pages: { tweets: TweetBasic[] }[] };

export const Tweet: FC = () => {
  const session = useSession();
  const tweet = useTweet();
  const router = useRouter();
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
        title: "Error",
        description: "Error deleting tweet.",
      });
    },
    onSuccess: () => {
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
    <div
      className="flex border-t border-x p-2 hover:cursor-pointer hover:bg-secondary/10"
      onClick={() => {
        router.push(`/${tweet.author.username}/${tweet.id}`);
      }}
    >
      <div className="flex w-full">
        <UserAvatar
          className="mx-2"
          width={44}
          height={44}
          user={tweet.author}
          linkToProfile={true}
        />
        <div className="flex flex-col w-full">
          <div className="ml-1">
            <div className="flex justify-between">
              <Link
                onClick={(e) => {
                  e.stopPropagation();
                }}
                href={`/${tweet.author.username}`}
              >
                <span className="mr-0.5 hover:underline font-semibold">
                  {tweet.author.name}
                </span>
                <span className="ml-0.5 text-sm text-primary/50">{`@${tweet.author.username}`}</span>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="p-1 text-primary/50 hover:text-twitter-blue hover:bg-twitter-blue/10 rounded-full mt-[-4px]">
                  <MoreHorizontalIcon className="p-1" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-background">
                  {session.user.id === tweet.author.id ? (
                    <DropdownMenuItem asChild>
                      <button
                        className="w-full h-full text-red-500 focus:text-red-500 hover:cursor-pointer"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTweet.mutate({ id: tweet.id });
                        }}
                      >
                        <Trash2Icon className="p-[2px] mr-0.5" />
                        <span className="ml-0.5 font-bold">Delete</span>
                      </button>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem>
                      <UserPlusIcon className="p-[2px] mr-0.5" />
                      <span className="ml-0.5 font-bold">{`Follow @${tweet.author.username}`}</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mt-[-4px] mb-2">
              <p className="mb-2 line-clamp-4 break-words">{tweet.content}</p>
              <AttachmentsView attachments={tweet.attachments} />
            </div>
          </div>
          <div className="flex justify-between w-full">
            <ReplyInteraction />
            <RetweetInteraction />
            <LikeInteraction />
            <ViewsInteraction />
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};
