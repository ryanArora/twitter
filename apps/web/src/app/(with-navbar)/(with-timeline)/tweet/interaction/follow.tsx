import { UserPlusIcon } from "lucide-react";
import { type FC } from "react";
import { useTweet } from "../tweetContext";

type FollowInteractionProps = {
  onMutate: () => void;
};

export const FollowInteraction: FC<FollowInteractionProps> = ({ onMutate }) => {
  const tweet = useTweet();

  return (
    <button
      className="flex items-center p-2 hover:cursor-pointer hover:bg-primary/10"
      onClick={async (e) => {
        e.stopPropagation();
        onMutate();

        // mutate
      }}
      type="button"
    >
      <UserPlusIcon className="mr-1 p-[2px]" />
      <span className="text-sm font-semibold">{`Follow @${tweet.author.username}`}</span>
    </button>
  );
};
