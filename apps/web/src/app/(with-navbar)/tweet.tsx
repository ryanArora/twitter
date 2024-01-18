import { Button } from "@repo/ui/components/button";
import { formatNumberShort } from "@repo/utils/str";
import { BarChart2Icon, MessageCircleIcon } from "lucide-react";
import { type FC } from "react";
import { UserAvatar } from "./home/user-avatar";
import { Like } from "./like";
import { Retweet } from "./retweet";

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
    <div
      className="flex items-start border p-2 hover:cursor-pointer"
      onClick={() => {
        window.location.href = `/${tweet.author.username}/${tweet.id}`;
      }}
    >
      <UserAvatar
        className="hi m-2 hover:cursor-pointer"
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
          <span className="py-2 pl-2 pr-1">{tweet.author.name}</span>
          <span className="py-2 pr-2 pl-1">{`@${tweet.author.username}`}</span>
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
