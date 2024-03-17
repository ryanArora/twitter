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
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button
          {...props}
          className={cn(
            `ml-[-0.5rem] rounded-full p-2 text-primary/50 transition-colors hover:bg-twitter-blue/10 hover:text-twitter-blue`,
            className,
          )}
          onClick={(e) => {
            e.stopPropagation();
          }}
          ref={ref}
          type="button"
          variant="ghost"
        >
          <MessageCircleIcon />
          {tweet._count.replies > 0 ? (
            <p className="ml-1">{formatNumberShort(tweet._count.replies, 1)}</p>
          ) : null}
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay>
          <DialogContent className="w-[600px]">
            <Tweet disableInteractions={true} />
            <PostTweet
              dontLinkToProfile
              inputPlaceholder="Post your reply"
              onSuccess={() => {
                setOpen(false);
              }}
              parentTweetId={tweet.id}
              submitButtonText="Reply"
            />
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
});
ReplyInteraction.displayName = Button.displayName;
