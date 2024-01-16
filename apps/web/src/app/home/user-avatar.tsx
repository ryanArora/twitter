import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { type FC } from "react";

function getInitials(name: string) {
  let initials = "";
  for (const n of name.split(" ")) {
    if (n[0] !== "") {
      initials += n[0];
    }
  }

  return initials;
}

export const UserAvatar: FC<{
  user: { name: string; profilePictureUrl: string | null };
  className?: string;
}> = ({ user, ...props }) => {
  return (
    <Avatar {...props}>
      {user.profilePictureUrl ? (
        <AvatarImage src={user.profilePictureUrl} />
      ) : null}
      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
    </Avatar>
  );
};
