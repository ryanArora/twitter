import { type RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { formatNumberShort } from "@repo/utils/str";
import { BarChart2Icon, MessageCircleIcon } from "lucide-react";
import { type FC } from "react";
import { Like } from "./like";
import { Retweet } from "./retweet";
import { UserAvatar } from "../user-avatar";

export type TweetProps = {
  tweet: RouterOutputs["tweet"]["timeline"]["tweets"][number];
};

export const Tweet: FC<TweetProps> = ({ tweet }) => {
  return (
    <div
      className="flex items-start border p-2 hover:cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        window.location.href = `/${tweet.author.username}/${tweet.id}`;
      }}
    >
      <UserAvatar
        className="m-2 hover:cursor-pointer"
        user={tweet.author}
        onClick={(e) => {
          e.stopPropagation();
          window.location.href = `/${tweet.author.username}`;
        }}
      />
      <div className="flex flex-col">
        <div
          className="w-fit hover:cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = `/${tweet.author.username}`;
          }}
        >
          <span className="p-2">{tweet.author.name}</span>
          <span className="p-2">{`@${tweet.author.username}`}</span>
        </div>
        <div className="break-all w-fit">
          <p className="p-2">{tweet.content}</p>
        </div>
        <div>
          <Button
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
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
              e.stopPropagation();
            }}
          >
            <BarChart2Icon />
            <p>{formatNumberShort(tweet._count.views, 1)}</p>
          </Button>
        </div>
      </div>
    </div>
  );
};
