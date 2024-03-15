import { useRouter } from "next/navigation";
import { type FC } from "react";
import { FollowButton } from "../(with-profile-header)/follow-button";
import { type UserProfile } from "../../../../../../../../../packages/api/src/router/user";
import { UserAvatar } from "@/app/(with-navbar)/user-avatar";

type FollowUserProps = {
  user: Pick<
    UserProfile,
    "avatarUrl" | "bio" | "followers" | "id" | "name" | "username"
  >;
};

export const FollowUser: FC<FollowUserProps> = ({ user }) => {
  const router = useRouter();

  return (
    <div
      className="pb-2 pt-2 hover:cursor-pointer hover:bg-secondary/10"
      onClick={() => {
        router.push(`/${user.username}`);
      }}
    >
      <div className="flex justify-between">
        <div className="flex">
          <UserAvatar
            className="mx-2"
            height={44}
            onClick="link"
            user={user}
            width={44}
          />
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-primary/50">{`@${user.username}`}</p>
          </div>
        </div>

        <FollowButton className="m-2" user={user} />
      </div>
      <p className="ml-[60px] mr-2 line-clamp-2 text-sm">{user.bio}</p>
    </div>
  );
};
