"use client";

import { Button } from "@repo/ui/components/button";
import { Image } from "@repo/ui/components/image";
import { formatNumberShort } from "@repo/utils/str";
import { CalendarRangeIcon } from "lucide-react";
import Link from "next/link";
import { type FC, type ReactNode } from "react";
import { FollowButton } from "./follow-button";
import { useProfile } from "./profileContext";
import { useSession } from "../../../../sessionContext";
import { Header } from "@/app/(with-navbar)/header";
import { UserAvatar } from "@/app/(with-navbar)/user-avatar";

export const LayoutClient: FC<{ children: ReactNode }> = ({ children }) => {
  const session = useSession();
  const profile = useProfile();

  return (
    <div className="h-full min-h-screen border-x">
      <Header
        title={profile.name}
        subtitle={`${formatNumberShort(profile._count.tweets, 1)} tweets`}
      />
      <div className="border-b">
        <Image
          className="object-cover"
          src={profile.bannerUrl}
          alt={`${profile.username}'s banner`}
          width={598}
          height={200}
          draggable={false}
          onClick="focus"
          fallbackText=""
        />
        <div className="flex justify-between">
          <UserAvatar
            user={profile}
            className="ml-[10px] mt-[-64px]"
            width={128}
            height={128}
            onClick="focus"
          />
          <div className="m-4">
            {profile.id === session.user.id ? (
              <Button className="rounded-full font-semibold" asChild>
                <Link href="/settings/profile">Edit profile</Link>
              </Button>
            ) : (
              <FollowButton />
            )}
          </div>
        </div>
        <div className="p-3">
          <div className="mb-3">
            <p className="w-fit truncate text-xl font-bold">{profile.name}</p>
            <p className="w-fit truncate text-primary/50">{`@${profile.username}`}</p>
          </div>
          {profile.bio && <p className="mb-3 break-words">{profile.bio}</p>}
          <div className="mb-3 flex items-center text-primary/50">
            <CalendarRangeIcon className="p-1" />
            <span className="ml-0.5 text-sm">
              {`Joined ${profile.createdAt.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}`}
            </span>
          </div>
          <nav className="flex">
            <Link
              className="pr-2 hover:underline"
              href={`/${profile.username}/following`}
            >
              <span className="text-sm font-bold">
                {profile._count.following}
              </span>
              <span className="text-sm text-primary/50"> Following</span>
            </Link>
            <Link
              className="pr-2 hover:underline"
              href={`/${profile.username}/followers`}
            >
              <span className="text-sm font-bold">
                {profile._count.followers}
              </span>
              <span className="text-sm text-primary/50"> Followers</span>
            </Link>
          </nav>
        </div>
        <nav className="flex justify-evenly">
          <Link
            className="rounded-md p-4 hover:bg-secondary/90"
            href={`/${profile.username}`}
          >
            Tweets
          </Link>
          <Link
            className="rounded-md p-4 hover:bg-secondary/90"
            href={`/${profile.username}/replies`}
          >
            Replies
          </Link>
          <Link
            className="rounded-md p-4 hover:bg-secondary/90"
            href={`/${profile.username}/media`}
          >
            Media
          </Link>
          <Link
            className="rounded-md p-4 hover:bg-secondary/90"
            href={`/${profile.username}/likes`}
          >
            Likes
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
};
