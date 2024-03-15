import { useRouter } from "next/navigation";
import { type FC } from "react";
import { FollowButton } from "../(with-profile-header)/follow-button";
import { type UserProfile } from "../../../../../../../../../packages/api/src/router/user";
import { UserAvatar } from "@/app/(with-navbar)/user-avatar";
import { useSession } from "@/app/sessionContext";

type FollowUserProps = {
  user: Pick<
    UserProfile,
    "avatarUrl" | "bio" | "followers" | "id" | "name" | "username"
  >;
};

export const FollowUser: FC<FollowUserProps> = ({ user }) => {
  const router = useRouter();
  const session = useSession();

  return (
    <div
      className="p-4 hover:cursor-pointer hover:bg-secondary/10"
      onClick={() => {
        router.push(`/${user.username}`);
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex">
          <UserAvatar
            className="mr-2"
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
        {session.user.id != user.id ? <FollowButton user={user} /> : null}
      </div>
      <p className="ml-[52px] mr-2 line-clamp-2 text-sm">{user.bio}</p>
    </div>
  );
};
