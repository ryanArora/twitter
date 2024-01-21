"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import { formatNumberShort } from "@repo/utils/str";
import { ArrowLeft, CalendarRangeIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FC, type ReactNode } from "react";
import { FollowButton } from "./follow-button";
import { useProfile } from "./profileContext";
import { UserAvatar } from "@/app/(with-navbar)/user-avatar";
import { useSession } from "@/context/session";
import { api } from "@/trpc/react";

const FIVE_MINUTES_MS = 1000 * 60 * 5;

export const LayoutClient: FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const session = useSession();
  const profile = useProfile();

  const { data: bannerUrl } = api.asset.getBannerUrl.useQuery(
    {
      userId: profile.id,
    },
    {
      staleTime: FIVE_MINUTES_MS,
    },
  );

  return (
    <div className="border-x border-right h-full w-full overflow-y-scroll">
      <div className="border-b">
        <div className="flex items-center">
          <Button
            className="p-0 mx-2 rounded-full"
            type="button"
            variant="ghost"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mx-1.5" />
          </Button>
          <div className="mx-4 my-2">
            <p className="text-xl font-bold">{profile.name}</p>
            <p className="text-sm text-primary/50">{`${formatNumberShort(
              profile._count.tweets,
              1,
            )} tweets`}</p>
          </div>
        </div>
        {/*
            This "Avatar" is the banner.
            We do this to take advantage of the AvatarFallback component.
          */}
        <Avatar className="rounded-none w-full h-[200px]">
          <AvatarImage src={bannerUrl} />
          <AvatarFallback className="rounded-none w-full h-[200px]" />
        </Avatar>
        <div className="flex justify-between">
          <UserAvatar
            user={profile}
            className="w-[128px] h-[128px] mt-[-64px] ml-[10px]"
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
            <p className="text-xl font-bold w-fit truncate">{profile.name}</p>
            <p className="text-primary/50 w-fit truncate">{`@${profile.username}`}</p>
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
              <span className="font-bold text-sm">
                {profile._count.following}
              </span>
              <span className="text-primary/50 text-sm"> Following</span>
            </Link>
            <Link
              className="pr-2 hover:underline"
              href={`/${profile.username}/followers`}
            >
              <span className="font-bold text-sm">
                {profile._count.followers}
              </span>
              <span className="text-primary/50 text-sm"> Followers</span>
            </Link>
          </nav>
        </div>
        <nav className="flex justify-evenly">
          <Link
            className="p-4 hover:bg-secondary/90 rounded-md"
            href={`/${profile.username}`}
          >
            Tweets
          </Link>
          <Link
            className="p-4 hover:bg-secondary/90 rounded-md"
            href={`/${profile.username}/replies`}
          >
            Replies
          </Link>
          <Link
            className="p-4 hover:bg-secondary/90 rounded-md"
            href={`/${profile.username}/media`}
          >
            Media
          </Link>
          <Link
            className="p-4 hover:bg-secondary/90 rounded-md"
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
