"use client";

import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/utils";
import { formatNumberShort } from "@repo/utils/str";
import { MessageCircleIcon } from "lucide-react";
import React, { forwardRef } from "react";
import { useTweet } from "../tweetContext";

export type ReplyInteractionProps = Record<string, unknown>;

export const ReplyInteraction = forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & ReplyInteractionProps
>(({ className, ...props }, ref) => {
  const tweet = useTweet();

  return (
    <Button
      {...props}
      ref={ref}
      className={cn(
        `m-0 p-2 rounded-full hover:text-twitter-blue hover:bg-twitter-blue/10 transition-colors`,
        className,
      )}
      type="button"
      variant="ghost"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        e.nativeEvent.stopPropagation();
      }}
    >
      <MessageCircleIcon />
      <p className="ml-1">{formatNumberShort(tweet._count.replies, 1)}</p>
    </Button>
  );
});
ReplyInteraction.displayName = Button.displayName;
