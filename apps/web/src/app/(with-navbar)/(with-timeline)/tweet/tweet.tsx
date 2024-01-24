"use client";

import { useRouter } from "next/navigation";
import { type FC } from "react";
import { LikeInteraction } from "./interaction/like";
import { ReplyInteraction } from "./interaction/reply";
import { RetweetInteraction } from "./interaction/retweet";
import { ViewsInteraction } from "./interaction/views";
import { useTweet } from "./tweetContext";
import { UserAvatar } from "../../user-avatar";
import { AttachmentsView } from "../home/attatchments-view";

export const Tweet: FC = () => {
  const tweet = useTweet();
  const router = useRouter();

  return (
    <div
      className="flex border p-2"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        e.nativeEvent.stopPropagation();
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
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                e.nativeEvent.stopPropagation();
                router.push(`/${tweet.author.username}`);
              }}
            >
              <span className="mr-0.5 hover:underline font-semibold">
                {tweet.author.name}
              </span>
              <span className="ml-0.5 text-sm text-primary/50">{`@${tweet.author.username}`}</span>
            </div>
            <div className="mb-2">
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
