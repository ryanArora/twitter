import { UserPlusIcon } from "lucide-react";
import { type FC } from "react";
import { useTweet } from "../tweetContext";

export const FollowInteraction: FC = () => {
  const tweet = useTweet();

  return (
    <button
      className="flex items-center p-2 hover:cursor-pointer hover:bg-primary/10"
      onClick={(e) => {
        e.stopPropagation();
      }}
      type="button"
    >
      <UserPlusIcon className="mr-1 p-[2px]" />
      <span className="text-sm font-semibold">{`Follow @${tweet.author.username}`}</span>
    </button>
  );
};
