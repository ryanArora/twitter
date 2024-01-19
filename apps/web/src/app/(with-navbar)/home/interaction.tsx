import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/utils";
import { formatNumberShort } from "@repo/utils/str";
import React, { forwardRef, type ReactNode } from "react";

export type InteractionProps = {
  count: number;
  color: string;
  icon: ReactNode;
};

const Interaction = forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & InteractionProps
>(({ count, color, icon, className, ...props }, ref) => {
  return (
    <Button
      {...props}
      ref={ref}
      className={cn(
        `m-0 p-2 rounded-full hover:text-${color} hover:bg-${color}/10 transition-colors`,
        className,
      )}
      type="button"
      variant="ghost"
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      {icon}
      <p className="ml-1">{formatNumberShort(count, 1)}</p>
    </Button>
  );
});
Interaction.displayName = Button.displayName;

export { Interaction };
