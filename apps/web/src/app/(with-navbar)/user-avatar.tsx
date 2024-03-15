"use client";

import { type RouterOutputs } from "@repo/api";
import { Image } from "@repo/ui/components/image";
import { cn } from "@repo/ui/utils";
import { getInitials } from "@repo/utils/str";
import React, { forwardRef } from "react";

export type UserAvatarProps = {
  height?: number;
  onClick?: React.ComponentProps<typeof Image>["onClick"];
  user: Pick<
    NonNullable<RouterOutputs["user"]["find"]>,
    "avatarUrl" | "id" | "name" | "username"
  >;
  width?: number;
};

export const UserAvatar = forwardRef<
  React.ElementRef<typeof Image>,
  Omit<React.ComponentPropsWithoutRef<typeof Image>, "alt" | "src"> &
    UserAvatarProps
>(
  (
    { className, height = 40, onClick = "link", user, width = 40, ...props },
    ref,
  ) => {
    return (
      <Image
        alt={`@${user.username}'s avatar`}
        className={cn("rounded-full", className)}
        draggable={false}
        fallbackText={getInitials(user.name)}
        height={height}
        href={`/${user.username}`}
        onClick={onClick}
        ref={ref}
        src={user.avatarUrl}
        width={width}
        {...props}
      />
    );
  },
);
UserAvatar.displayName = "UserAvatar";
