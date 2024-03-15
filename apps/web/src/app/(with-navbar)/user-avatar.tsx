"use client";

import { type RouterOutputs } from "@repo/api";
import { Image } from "@repo/ui/components/image";
import { cn } from "@repo/ui/utils";
import { getInitials } from "@repo/utils/str";
import React, { forwardRef } from "react";

export type UserAvatarProps = {
  user: Pick<
    NonNullable<RouterOutputs["user"]["find"]>,
    "id" | "name" | "username" | "avatarUrl"
  >;
  width?: number;
  height?: number;
  onClick?: React.ComponentProps<typeof Image>["onClick"];
};

export const UserAvatar = forwardRef<
  React.ElementRef<typeof Image>,
  Omit<React.ComponentPropsWithoutRef<typeof Image>, "alt" | "src"> &
    UserAvatarProps
>(
  (
    { className, user, width = 40, height = 40, onClick = "link", ...props },
    ref,
  ) => {
    return (
      <Image
        className={cn("rounded-full", className)}
        src={user.avatarUrl}
        alt={`@${user.username}'s avatar`}
        width={width}
        height={height}
        fallbackText={getInitials(user.name)}
        onClick={onClick}
        href={`/${user.username}`}
        draggable={false}
        ref={ref}
        {...props}
      />
    );
  },
);
UserAvatar.displayName = "UserAvatar";
