"use client";

import { Button } from "@repo/ui/components/button";
import { Spinner } from "@repo/ui/components/spinner";
import { TypographyH3, TypographyH4 } from "@repo/ui/components/typography";
import { formatNumberShort } from "@repo/utils/str";
import { ArrowLeft, CalendarRangeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
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
            <TypographyH4>{profile.name}</TypographyH4>
            <span>{`${formatNumberShort(
              profile._count.tweets,
              1,
            )} tweets`}</span>
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
        <div className="mb-[64px]">
          <div className="absolute">
            <UserAvatar
              user={profile}
              className="w-[128px] h-[128px] relative bottom-[64px] left-[10px]"
            />
          </div>
        </div>
        <div className="p-2">
          <TypographyH3>{profile.name}</TypographyH3>
          <TypographyH4>{`@${profile.username}`}</TypographyH4>
        </div>
        <div className="p-2 flex items-center">
          <CalendarRangeIcon className="mr-0.5" />
          <span className="ml-0.5">
            {`Joined ${profile.createdAt.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}`}
          </span>
        </div>
        <nav className="p-2 flex">
          <Link
            className="pr-2 hover:underline"
            href={`/${profile.username}/following`}
          >{`${profile._count.following} Following`}</Link>
          <Link
            className="pl-2 hover:underline"
            href={`/${profile.username}/followers`}
          >{`${profile._count.following} Followers`}</Link>
        </nav>
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
      <ProfileProvider profile={profile}>{children}</ProfileProvider>
    </div>
  );
}
