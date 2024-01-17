import { Button } from "@repo/ui/components/button";
import { formatNumberShort } from "@repo/utils/str";
import { BarChart2Icon, MessageCircleIcon, Repeat2Icon } from "lucide-react";
import { type FC } from "react";
import { Like } from "./like";
import { UserAvatar } from "./user-avatar";

export type TweetProps = {
  tweet: {
    id: string;
    content: string;
    attachments: string[];
    author: {
      id: string;
      username: string;
      name: string;
      profilePictureUrl: string | null;
    };
    _count: {
      replies: number;
      retweets: number;
      likes: number;
      views: number;
    };
    likes: {
      user: {
        id: string;
        username: string;
        name: string;
        profilePictureUrl: string | null;
      };
      createdAt: Date;
    }[];
    retweets: {
      user: {
        id: string;
        username: string;
        name: string;
        profilePictureUrl: string | null;
      };
      createdAt: Date;
    }[];
  };
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
          <Button variant="ghost">
            <Repeat2Icon />
            <p>{formatNumberShort(tweet._count.retweets, 1)}</p>
          </Button>
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
