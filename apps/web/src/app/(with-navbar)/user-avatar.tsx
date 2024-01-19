import { type Session } from "@repo/api/session";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { getInitials } from "@repo/utils/str";
import Link from "next/link";
import React, { forwardRef } from "react";

export type UserAvatarProps = {
  user: Pick<Session["user"], "name" | "profilePictureUrl">;
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

export type UserAvatarWithLinkProps = UserAvatarProps & {
  user: UserAvatarProps["user"] & Pick<Session["user"], "username">;
  href?: string;
};

const UserAvatarWithLink = forwardRef<
  React.ElementRef<typeof Link>,
  Omit<React.ComponentPropsWithoutRef<typeof Link>, "href"> &
    UserAvatarWithLinkProps
>(({ user, href = `/${user.username}`, ...props }, ref) => {
  return (
    <Avatar ref={ref} {...props}>
      <Link className="w-fit h-fit" href={href}>
        {user.profilePictureUrl ? (
          <AvatarImage src={user.profilePictureUrl} />
        ) : null}
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Link>
    </Avatar>
  );
});
UserAvatarWithLink.displayName = Avatar.displayName;

export { UserAvatar, UserAvatarWithLink };
