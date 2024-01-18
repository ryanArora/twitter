import { type RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { formatNumberShort } from "@repo/utils/str";
import { BarChart2Icon, MessageCircleIcon } from "lucide-react";
import Link from "next/link";
import { type FC } from "react";
import { Like } from "./like";
import { Retweet } from "./retweet";
import { UserAvatarWithLink } from "../user-avatar";

export type TweetProps = {
  tweet: RouterOutputs["tweet"]["timeline"]["tweets"][number];
};

export const Tweet: FC<TweetProps> = ({ tweet }) => {
  return (
    <Link
      className="flex items-start border p-2"
      href={`/${tweet.author.username}/${tweet.id}`}
    >
      <UserAvatarWithLink className="m-2" user={tweet.author} />
      <div className="flex flex-col">
        <Link className="w-fit" href={`/${tweet.author.username}`}>
          <span className="p-2 hover:underline">{tweet.author.name}</span>
          <span className="p-2">{`@${tweet.author.username}`}</span>
        </Link>
        <div className="p-2">
          <p className="line-clamp-4 whitespace-pre-wrap break-all">
            {tweet.content}
          </p>
        </div>
        <div>
          <Button
            variant="ghost"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <MessageCircleIcon />
            <p>{formatNumberShort(tweet._count.replies, 1)}</p>
          </Button>
          <Retweet tweet={tweet} />
          <Like tweet={tweet} />
          <Button
            variant="ghost"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <BarChart2Icon />
            <p>{formatNumberShort(tweet._count.views, 1)}</p>
          </Button>
        </div>
      </div>
    </Link>
  );
};
