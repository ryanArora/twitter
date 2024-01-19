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
            <Button
              className="m-0 p-2 rounded-full hover:text-twitter-blue hover:bg-twitter-blue/10 transition-colors"
              type="button"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <MessageCircleIcon />
              <p className="ml-1">
                {formatNumberShort(tweet._count.replies, 1)}
              </p>
            </Button>
            <Button
              className="m-0 p-2 rounded-full hover:text-twitter-retweet hover:bg-twitter-retweet/10 transition-colors"
              type="button"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <Repeat2Icon />
              <p className="ml-1">
                {formatNumberShort(tweet._count.retweets, 1)}
              </p>
            </Button>
            <Button
              className="m-0 p-2 rounded-full hover:text-twitter-like hover:bg-twitter-like/10 transition-colors"
              type="button"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <HeartIcon />
              <p className="ml-1">{formatNumberShort(tweet._count.likes, 1)}</p>
            </Button>
            <Button
              className="m-0 p-2 rounded-full hover:text-twitter-blue hover:bg-twitter-blue/10 transition-colors"
              type="button"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <BarChart2Icon />
              <p className="ml-1">{formatNumberShort(tweet._count.views, 1)}</p>
            </Button>
            <div></div>
          </div>
        </div>
      </div>
    </Link>
  );
};
