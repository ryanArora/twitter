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
      <BarChart2Icon />
      {tweet._count.views > 0 ? (
        <p className="ml-1">{formatNumberShort(tweet._count.views, 1)}</p>
      ) : null}
    </Button>
  );
});
ViewsInteraction.displayName = Button.displayName;
