"use client";

import { Button } from "@repo/ui/components/button";
import { Spinner } from "@repo/ui/components/spinner";
import { TypographyH3, TypographyH4 } from "@repo/ui/components/typography";
import { formatNumberShort } from "@repo/utils/str";
import { ArrowLeft, CalendarRangeIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserAvatar } from "../user-avatar";
import { api } from "@/trpc/react";

export default function ProfilePage({
  params,
}: {
  params: { profile: string };
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
    <div className="truncate border-x border-right h-full">
      <div className="flex items-center">
        <Button
          className="p-0 m-0 rounded-full"
          type="button"
          variant="ghost"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mx-2" />
        </Button>
        <div className="mx-4 my-2">
          <TypographyH4>{profile.name}</TypographyH4>
          <span>{`${formatNumberShort(profile._count.tweets, 1)} tweets`}</span>
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
        <p className="flex items-center">
          <CalendarRangeIcon className="mr-0.5" />
          <span className="ml-0.5">
            {`Joined ${profile.createdAt.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}`}
          </span>
        </p>
      </div>
    </div>
  );
}
