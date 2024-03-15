"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { toast } from "@repo/ui/components/use-toast";
import { cn } from "@repo/ui/utils";
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

export type TweetProps = {
  big?: boolean;
  disableInteractions?: boolean;
};

export const Tweet: FC<TweetProps> = ({ big, disableInteractions }) => {
  const session = useSession();
  const tweet = useTweet();
  const router = useRouter();
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
        title: "Error",
        description: "Error deleting tweet.",
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

  if (big) {
    return (
      <div
        className={cn(
          "border-b p-2",
          disableInteractions
            ? null
            : "hover:cursor-pointer hover:bg-secondary/10",
        )}
        onClick={
          disableInteractions
            ? undefined
            : () => {
                router.push(`/${tweet.author.username}/${tweet.id}`);
              }
        }
      >
        <div className="mb-2 flex">
          <div className="flex w-full">
            <UserAvatar
              className="mx-2"
              width={44}
              height={44}
              user={tweet.author}
              onClick={null}
            />
            <div className="flex w-full flex-col">
              <div className="ml-1">
                <div className="flex justify-between">
                  {disableInteractions ? (
                    <div>
                      <p className="font-semibold">{tweet.author.name}</p>
                      <p className="text-sm text-primary/50">{`@${tweet.author.username}`}</p>
                    </div>
                  ) : (
                    <Link
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      href={`/${tweet.author.username}`}
                    >
                      <p className="font-semibold hover:underline">
                        {tweet.author.name}
                      </p>
                      <p className="text-sm text-primary/50">{`@${tweet.author.username}`}</p>
                    </Link>
                  )}

                  {disableInteractions ? null : (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="mt-[-4px] rounded-full p-1 text-primary/50 hover:bg-twitter-blue/10 hover:text-twitter-blue">
                        <MoreHorizontalIcon className="p-1" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-background">
                        {session.user.id === tweet.author.id ? (
                          <DropdownMenuItem asChild>
                            <button
                              className="h-full w-full text-red-500 hover:cursor-pointer focus:text-red-500"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTweet.mutate({ id: tweet.id });
                              }}
                            >
                              <Trash2Icon className="mr-0.5 p-[2px]" />
                              <span className="ml-0.5 font-bold">Delete</span>
                            </button>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>
                            <UserPlusIcon className="mr-0.5 p-[2px]" />
                            <span className="ml-0.5 font-bold">{`Follow @${tweet.author.username}`}</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-2 mb-2">
          <p className="mb-2 whitespace-pre-wrap break-words text-lg">
            {tweet.content}
          </p>
          <AttachmentsView
            attachments={tweet.attachments}
            disablePreview={disableInteractions}
          />
        </div>
        <div className="mx-2 mb-2">
          <p className="text-sm text-primary/50">
            {new Intl.DateTimeFormat(undefined, {
              weekday: "short",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
              month: "short",
              day: "numeric",
            }).format(tweet.createdAt)}
          </p>
        </div>
        {disableInteractions ? null : (
          <div className="mx-2 flex justify-between">
            <ReplyInteraction />
            <RetweetInteraction />
            <LikeInteraction />
            <ViewsInteraction />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex border-b p-2",
        disableInteractions
          ? null
          : "hover:cursor-pointer hover:bg-secondary/10",
      )}
      onClick={
        disableInteractions
          ? undefined
          : () => {
              router.push(`/${tweet.author.username}/${tweet.id}`);
            }
      }
    >
      <div className="flex w-full">
        <UserAvatar
          className="mx-2"
          width={44}
          height={44}
          user={tweet.author}
          onClick={null}
        />
        <div className="flex w-full flex-col">
          <div className="ml-1">
            <div className="flex justify-between">
              {disableInteractions ? (
                <div>
                  <span className="mr-0.5 font-semibold">
                    {tweet.author.name}
                  </span>
                  <span className="ml-0.5 text-sm text-primary/50">{`@${tweet.author.username}`}</span>
                </div>
              ) : (
                <Link
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  href={`/${tweet.author.username}`}
                >
                  <span className="mr-0.5 font-semibold hover:underline">
                    {tweet.author.name}
                  </span>
                  <span className="ml-0.5 text-sm text-primary/50">{`@${tweet.author.username}`}</span>
                </Link>
              )}

              {disableInteractions ? null : (
                <DropdownMenu>
                  <DropdownMenuTrigger className="mt-[-4px] rounded-full p-1 text-primary/50 hover:bg-twitter-blue/10 hover:text-twitter-blue">
                    <MoreHorizontalIcon className="p-1" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-background">
                    {session.user.id === tweet.author.id ? (
                      <DropdownMenuItem asChild>
                        <button
                          className="h-full w-full text-red-500 hover:cursor-pointer focus:text-red-500"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTweet.mutate({ id: tweet.id });
                          }}
                        >
                          <Trash2Icon className="mr-0.5 p-[2px]" />
                          <span className="ml-0.5 font-bold">Delete</span>
                        </button>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem>
                        <UserPlusIcon className="mr-0.5 p-[2px]" />
                        <span className="ml-0.5 font-bold">{`Follow @${tweet.author.username}`}</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <div
              className={cn("mb-2", disableInteractions ? null : "mt-[-4px]")}
            >
              <p className="mb-2 line-clamp-4 whitespace-pre-wrap break-words">
                {tweet.content}
              </p>
              <AttachmentsView
                attachments={tweet.attachments}
                disablePreview={disableInteractions}
              />
            </div>
          </div>
          {disableInteractions ? null : (
            <div className="flex w-full justify-between">
              <ReplyInteraction />
              <RetweetInteraction />
              <LikeInteraction />
              <ViewsInteraction />
              <div></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
