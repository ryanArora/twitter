import { type Session } from "@repo/api/session";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { getInitials } from "@repo/utils/str";
import { type Expand } from "@repo/utils/types";
import Link from "next/link";
import React, { forwardRef } from "react";

export type UserAvatarProps = {
  user: Expand<Pick<Session["user"], "name" | "profilePictureUrl">>;
};

const UserAvatar = forwardRef<
  React.ElementRef<typeof Avatar>,
  React.ComponentPropsWithoutRef<typeof Avatar> & UserAvatarProps
>(({ user, ...props }, ref) => {
  return (
    <Avatar ref={ref} {...props}>
      {user.profilePictureUrl ? (
        <AvatarImage src={user.profilePictureUrl} />
      ) : null}
      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
    </Avatar>
  );
});
UserAvatar.displayName = Avatar.displayName;

export type UserAvatarWithLinkProps = {
  user: Expand<
    Pick<Session["user"], "username" | "name" | "profilePictureUrl">
  >;
  href?: string;
};

const UserAvatarWithLink = forwardRef<
  React.ElementRef<typeof Link>,
  Omit<React.ComponentPropsWithoutRef<typeof Link>, "href"> &
    UserAvatarWithLinkProps
>(({ user, href = `/${user.username}`, ...props }, ref) => {
  return (
    <Link href={href} ref={ref} {...props}>
      <Avatar>
        {user.profilePictureUrl ? (
          <AvatarImage src={user.profilePictureUrl} />
        ) : null}
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>
    </Link>
  );
});
UserAvatarWithLink.displayName = Avatar.displayName;

export { UserAvatar, UserAvatarWithLink };
