"use client";

import { type RouterOutputs } from "@repo/api";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Image } from "@repo/ui/components/image";
import { cn } from "@repo/ui/utils";
import { getInitials } from "@repo/utils/str";
import { useRouter } from "next/navigation";
import React, { forwardRef } from "react";
import { api } from "@/trpc/react";

export type UserAvatarProps = {
  user: Pick<
    NonNullable<RouterOutputs["user"]["find"]>,
    "id" | "name" | "username"
  >;
  linkToProfile?: boolean;
  width?: number;
  height?: number;
  onClick?: React.ComponentProps<typeof Image>["onClick"];
};

const FIVE_MINUTES_MS = 1000 * 60 * 5;

export const UserAvatar = forwardRef<
  React.ElementRef<typeof Image>,
  React.ComponentPropsWithoutRef<typeof Image> & UserAvatarProps
>(
  (
    {
      className,
      user,
      linkToProfile,
      width = 40,
      height = 40,
      onClick = "link",
      ...props
    },
    ref,
  ) => {
    const router = useRouter();
    const { data: avatarUrl } = api.asset.getAvatarUrl.useQuery(
      { userId: user.id },
      { staleTime: FIVE_MINUTES_MS },
    );

    return (
      <Image
        className={cn("rounded-full", className)}
        src={avatarUrl}
        alt={`${user.name}'s avatar`}
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
        <AvatarImage
          src={avatarUrl}
          alt={`${user.name}'s avatar`}
          draggable={false}
        />
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>
    );
  },
);
UserAvatar.displayName = Avatar.displayName;
