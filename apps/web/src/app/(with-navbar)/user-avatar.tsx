"use client";

import { type RouterOutputs } from "@repo/api";
import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import { cn } from "@repo/ui/utils";
import { getInitials } from "@repo/utils/str";
import { useRouter } from "next/navigation";
import React, { forwardRef } from "react";

export type UserAvatarProps = {
  user: Pick<NonNullable<RouterOutputs["user"]["find"]>, "name" | "username">;
  linkToProfile?: boolean;
};

export const UserAvatar = forwardRef<
  React.ElementRef<typeof Avatar>,
  React.ComponentPropsWithoutRef<typeof Avatar> & UserAvatarProps
>(({ className, user, linkToProfile, ...props }, ref) => {
  const router = useRouter();

  return (
    <Avatar
      className={cn(linkToProfile ? "hover:cursor-pointer" : null, className)}
      onClick={(e) => {
        e.preventDefault();
        if (linkToProfile) {
          router.push(`/${user.username}`);
        }
      }}
      ref={ref}
      {...props}
    >
      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
    </Avatar>
  );
});
UserAvatar.displayName = Avatar.displayName;
