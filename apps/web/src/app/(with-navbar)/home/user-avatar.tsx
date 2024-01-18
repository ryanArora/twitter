import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { getInitials } from "@repo/utils/str";
import React, { type FC } from "react";

export const UserAvatar: FC<
  React.ComponentProps<typeof Avatar> & {
    user: { name: string; profilePictureUrl: string | null };
    className?: string;
  }
> = ({ user, ...props }) => {
  return (
    <Avatar {...props}>
      {user.profilePictureUrl ? (
        <AvatarImage src={user.profilePictureUrl} />
      ) : null}
      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
    </Avatar>
  );
};
