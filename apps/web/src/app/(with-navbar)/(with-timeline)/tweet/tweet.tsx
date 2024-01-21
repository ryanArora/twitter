"use client";

import Link from "next/link";
import { type FC } from "react";
import { LikeInteraction } from "./interaction/like";
import { ReplyInteraction } from "./interaction/reply";
import { RetweetInteraction } from "./interaction/retweet";
import { ViewsInteraction } from "./interaction/views";
import { useTweet } from "./tweetContext";
import { UserAvatar } from "../../user-avatar";

export const Tweet: FC = () => {
  const tweet = useTweet();

  return (
    <Link
      className="flex border p-2"
      href={`/${tweet.author.username}/${tweet.id}`}
    >
      <div className="flex w-full">
        <UserAvatar
          className="mx-2 h-[44px] w-[44px]"
          user={tweet.author}
          linkToProfile={true}
        />
        <div className="flex flex-col w-full">
          <div className="ml-1">
            <Link href={`/${tweet.author.username}`}>
              <span className="mr-0.5 hover:underline font-semibold">
                {tweet.author.name}
              </span>
              <span className="ml-0.5 text-sm text-primary/50">{`@${tweet.author.username}`}</span>
            </Link>
            <p className="mb-2 line-clamp-4 break-words">{tweet.content}</p>
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
    </Link>
  );
};
