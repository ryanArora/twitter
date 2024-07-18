import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { cn } from "@repo/ui/utils";
import { MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FC, useState } from "react";
import { BookmarkInteraction } from "./interaction/bookmark";
import { DeleteInteraction } from "./interaction/delete";
import { FollowInteraction } from "./interaction/follow";
import { LikeInteraction } from "./interaction/like";
import { ReplyInteraction } from "./interaction/reply";
import { RetweetInteraction } from "./interaction/retweet";
import { ViewsInteraction } from "./interaction/views";
import { useTweet } from "./tweetContext";
import { UserAvatar } from "../../user-avatar";
import { AttachmentsView } from "../home/attatchments-view";
import { useSession } from "@/app/sessionContext";

export type TweetProps = {
  big?: boolean;
  disableInteractions?: boolean;
};

export const Tweet: FC<TweetProps> = ({ big, disableInteractions }) => {
  const router = useRouter();
  const tweet = useTweet();
  const session = useSession();
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "border-b pb-2 pl-4 pr-2 pt-2",
        disableInteractions || big
          ? null
          : "hover:cursor-pointer hover:bg-secondary/10",
      )}
      onClick={
        disableInteractions || big
          ? undefined
          : () => {
              router.push(`/${tweet.author.username}/${tweet.id}`);
            }
      }
    >
      <div className={cn("flex justify-between", big ? "mb-2" : null)}>
        <div className="flex">
          <UserAvatar
            className="mr-2"
            height={44}
            onClick={disableInteractions ? null : "link"}
            user={tweet.author}
            width={44}
          />
          {disableInteractions ? (
            <div>
              <p className={cn("font-semibold", big ? "" : "mr-1 inline")}>
                {tweet.author.name}
              </p>
              <p
                className={cn("text-sm text-primary/50", big ? "" : "inline")}
              >{`@${tweet.author.username}`}</p>
            </div>
          ) : (
            <Link
              href={`/${tweet.author.username}`}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <p
                className={cn(
                  "font-semibold hover:underline",
                  big ? "" : "mr-1 inline",
                )}
              >
                {tweet.author.name}
              </p>
              <p
                className={cn("text-sm text-primary/50", big ? "" : "inline")}
              >{`@${tweet.author.username}`}</p>
            </Link>
          )}
        </div>
        {disableInteractions ? null : (
          <DropdownMenu onOpenChange={setOpen} open={open}>
            <DropdownMenuTrigger className="mt-[-4px] h-fit w-fit rounded-full p-1 text-primary/50 hover:bg-twitter-blue/10 hover:text-twitter-blue">
              <MoreHorizontalIcon className="p-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="m-0 bg-background p-0">
              {session.user.id === tweet.author.id ? (
                <DropdownMenuItem asChild>
                  <DeleteInteraction />
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem asChild>
                  <FollowInteraction
                    onMutate={() => {
                      setOpen(false);
                    }}
                  />
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <BookmarkInteraction
                  onMutate={() => {
                    setOpen(false);
                  }}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className={cn(big ? "" : "ml-[52px] mt-[-20px]")}>
        <p
          className={cn(
            "mb-2 whitespace-pre-wrap break-words",
            big ? "text-lg" : "line-clamp-4",
          )}
        >
          {tweet.content}
        </p>

        {tweet.attachments.length > 0 ? (
          <div className="mb-2">
            <AttachmentsView
              attachments={tweet.attachments}
              disablePreview={disableInteractions}
            />
          </div>
        ) : null}

        {big ? (
          <p className="mb-2 text-sm text-primary/50">
            {new Intl.DateTimeFormat("en-US", {
              day: "numeric",
              hour: "numeric",
              hour12: true,
              minute: "numeric",
              month: "short",
              weekday: "short",
            }).format(tweet.createdAt)}
          </p>
        ) : null}

        {disableInteractions ? null : (
          <div className="flex justify-between">
            <div className="flex grow basis-0 justify-start">
              <ReplyInteraction />
            </div>
            <div className="flex grow basis-0 justify-start">
              <RetweetInteraction />
            </div>
            <div className="flex grow basis-0 justify-start">
              <LikeInteraction />
            </div>
            <div className="flex grow basis-0 justify-start">
              <ViewsInteraction />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
