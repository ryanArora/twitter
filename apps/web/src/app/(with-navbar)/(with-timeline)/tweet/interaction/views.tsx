"use client";

import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/utils";
import { formatNumberShort } from "@repo/utils/str";
import { BarChart2Icon } from "lucide-react";
import React, { forwardRef } from "react";
import { useTweet } from "../tweetContext";

export type ViewsInteractionProps = Record<string, unknown>;

export const ViewsInteraction = forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & ViewsInteractionProps
>(({ className, ...props }, ref) => {
  const tweet = useTweet();

  return (
    <Button
      {...props}
      ref={ref}
      className={cn(
        `m-0 p-2 rounded-full text-primary/50 hover:text-twitter-blue hover:bg-twitter-blue/10 transition-colors`,
        className,
      )}
      type="button"
      variant="ghost"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <BarChart2Icon />
      <p className="ml-1">{formatNumberShort(tweet._count.views, 1)}</p>
    </Button>
  );
});
ViewsInteraction.displayName = Button.displayName;
