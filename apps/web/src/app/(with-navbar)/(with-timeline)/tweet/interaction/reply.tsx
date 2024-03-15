"use client";

import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { cn } from "@repo/ui/utils";
import { formatNumberShort } from "@repo/utils/str";
import { MessageCircleIcon } from "lucide-react";
import React, { forwardRef, useState } from "react";
import { PostTweet } from "../../home/post-tweet";
import { Tweet } from "../tweet";
import { useTweet } from "../tweetContext";

export type ReplyInteractionProps = Record<string, unknown>;

export const ReplyInteraction = forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & ReplyInteractionProps
>(({ className, ...props }, ref) => {
  const tweet = useTweet();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          {...props}
          ref={ref}
          className={cn(
            `m-0 rounded-full p-2 text-primary/50 transition-colors hover:bg-twitter-blue/10 hover:text-twitter-blue`,
            className,
          )}
          type="button"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <MessageCircleIcon />
          <p className="ml-1">{formatNumberShort(tweet._count.replies, 1)}</p>
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay>
          <DialogContent className="w-[600px]">
            <Tweet disableInteractions={true} />
            <PostTweet
              inputPlaceholder="Post your reply"
              submitButtonText="Reply"
              parentTweetId={tweet.id}
              dontLinkToProfile
              onSuccess={() => {
                setOpen(false);
              }}
            />
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
});
ReplyInteraction.displayName = Button.displayName;
