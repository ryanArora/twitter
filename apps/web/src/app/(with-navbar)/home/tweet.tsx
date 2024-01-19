import { type RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { formatNumberShort } from "@repo/utils/str";
import {
  BarChart2Icon,
  HeartIcon,
  MessageCircleIcon,
  Repeat2Icon,
} from "lucide-react";
import Link from "next/link";
import { type FC } from "react";
import { Interaction } from "./interaction";
import { UserAvatarWithLink } from "../user-avatar";

export type TweetProps = {
  tweet: RouterOutputs["tweet"]["timeline"]["tweets"][number];
};

export const Tweet: FC<TweetProps> = ({ tweet }) => {
  return (
    <Link
      className="flex border p-2"
      href={`/${tweet.author.username}/${tweet.id}`}
    >
      <div className="flex w-full">
        <UserAvatarWithLink
          className="mx-2 h-[44px] w-[44px]"
          user={tweet.author}
        />
        <div className="flex flex-col w-full">
          <div className="ml-1">
            <Link className="w-fit" href={`/${tweet.author.username}`}>
              <span className="mr-0.5 hover:underline font-semibold">
                {tweet.author.name}
              </span>
              <span className="ml-0.5 text-sm text-primary/50">{`@${tweet.author.username}`}</span>
            </Link>
            <div className="w-fit">
              <p className="line-clamp-4 whitespace-pre-wrap break-all mb-2">
                {tweet.content}
              </p>
            </div>
          </div>
          <div className="flex justify-between w-full">
            <Interaction
              color="twitter-blue"
              count={tweet._count.replies}
              icon={<MessageCircleIcon />}
            />
            <Interaction
              color="twitter-retweet"
              count={tweet._count.retweets}
              icon={<Repeat2Icon />}
            />
            <Interaction
              color="twitter-like"
              count={tweet._count.likes}
              icon={<HeartIcon />}
            />
            <Interaction
              color="twitter-blue"
              count={tweet._count.views}
              icon={<BarChart2Icon />}
            />
            <div></div>
          </div>
        </div>
      </div>
    </Link>
  );
};
