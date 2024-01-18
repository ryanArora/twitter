import { type Session } from "@repo/api/session";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { cn } from "@repo/ui/utils";
import { getInitials } from "@repo/utils/str";
import { type Expand } from "@repo/utils/types";
import React, { forwardRef } from "react";

export type UserAvatarProps = {
  user: Expand<Pick<Session["user"], "name" | "profilePictureUrl">>;
};

const UserAvatar = forwardRef<
  React.ElementRef<typeof Avatar>,
  React.ComponentPropsWithoutRef<typeof Avatar> & UserAvatarProps
>(({ user, className, ...props }, ref) => {
  return (
    <Avatar className={cn(className)} ref={ref} {...props}>
      {user.profilePictureUrl ? (
        <AvatarImage src={user.profilePictureUrl} />
      ) : null}
      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
    </Avatar>
  );
});

UserAvatar.displayName = Avatar.displayName;

export { UserAvatar };
