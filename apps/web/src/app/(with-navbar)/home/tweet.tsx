import { type RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { formatNumberShort } from "@repo/utils/str";
import { BarChart2Icon, MessageCircleIcon } from "lucide-react";
import { type FC } from "react";
import { Like } from "./like";
import { Retweet } from "./retweet";
import { UserAvatar } from "./user-avatar";

export type TweetProps = {
  tweet: RouterOutputs["tweet"]["timeline"]["tweets"][number];
};

export const Tweet: FC<TweetProps> = ({ tweet }) => {
  return (
    <div className="flex items-start border p-2">
      <UserAvatar className="hi m-2" user={tweet.author} />
      <div className="flex flex-col">
        <div className="w-fit">
          <span className="p-2">{tweet.author.name}</span>
          <span className="p-2">{`@${tweet.author.username}`}</span>
        </div>
        <div className="break-all w-fit">
          <p className="p-2">{tweet.content}</p>
        </div>
        <div>
          <Button variant="ghost">
            <MessageCircleIcon />
            <p>{formatNumberShort(tweet._count.replies, 1)}</p>
          </Button>
          <Retweet tweet={tweet} />
          <Like tweet={tweet} />
          <Button variant="ghost">
            <BarChart2Icon />
            <p>{formatNumberShort(tweet._count.views, 1)}</p>
          </Button>
        </div>
      </div>
    </div>
  );
};
