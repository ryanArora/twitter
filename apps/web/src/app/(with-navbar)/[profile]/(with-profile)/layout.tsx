"use client";

import { Button } from "@repo/ui/components/button";
import { Spinner } from "@repo/ui/components/spinner";
import { formatNumberShort } from "@repo/utils/str";
import { ArrowLeft, CalendarRangeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
import { FollowButton } from "./follow-button";
import { ProfileProvider } from "./profileContext";
import { UserAvatar } from "../../user-avatar";
import { api } from "@/trpc/react";

export default function ProfileLayout({
  params,
  children,
}: {
  params: { profile: string };
  children: ReactNode;
}) {
  const {
    data: profile,
    status,
    error,
  } = api.user.find.useQuery({
    username: params.profile,
  });

  const router = useRouter();

  if (status === "error") {
    return (
      <div>
        <p>{`Error ${error.message}`}</p>
      </div>
    );
  }

  if (status === "pending") {
    return <Spinner />;
  }

  if (profile === null) {
    return (
      <div>
        <p>Page not found</p>
      </div>
    );
  }

  return (
    <ProfileProvider profile={profile}>
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
          {profile.bannerUrl ? (
            <Image
              src={profile.bannerUrl}
              alt={profile.bannerUrl}
              width={600}
              height={200}
            />
          ) : (
            <div className="bg-red-900 w-full h-[200px]"></div>
          )}
          <div className="flex justify-between">
            <UserAvatar
              user={profile}
              className="w-[128px] h-[128px] mt-[-64px] ml-[10px]"
            />
            <div className="m-4">
              <FollowButton />
            </div>
          </div>
          <div className="p-3">
            <div className="mb-3">
              <p className="text-xl font-bold w-fit truncate">{profile.name}</p>
              <p className="text-primary/50 w-fit truncate">{`@${profile.username}`}</p>
            </div>
            {profile.bio && (
              <p className="mb-3 whitespace-pre-wrap break-all">
                {profile.bio}
              </p>
            )}
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
    </ProfileProvider>
  );
}
