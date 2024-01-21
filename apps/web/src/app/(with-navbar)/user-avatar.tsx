"use client";

import { type RouterOutputs } from "@repo/api";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
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
};

const FOUR_MINUTES_MS = 1000 * 60 * 5;

export const UserAvatar = forwardRef<
  React.ElementRef<typeof Avatar>,
  React.ComponentPropsWithoutRef<typeof Avatar> & UserAvatarProps
>(({ className, user, linkToProfile, ...props }, ref) => {
  const router = useRouter();
  const { data: url } = api.asset.getAvatarUrl.useQuery(
    { userId: user.id },
    { staleTime: FOUR_MINUTES_MS },
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
      <AvatarImage src={url} alt={`${user.name}'s avatar`} draggable={false} />
      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
    </Avatar>
  );
});
UserAvatar.displayName = Avatar.displayName;
