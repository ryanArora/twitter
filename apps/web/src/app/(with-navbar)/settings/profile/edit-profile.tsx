"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { CalendarRangeIcon } from "lucide-react";
import React, { useRef, type FC, type ElementRef } from "react";
import { UploadButton } from "./upload-button";
import { type Profile } from "../../(with-timeline)/[profile]/(with-profile)/profileContext";
import { UserAvatar } from "../../user-avatar";
import { api } from "@/trpc/react";

const FIVE_MINUTES_MS = 1000 * 60 * 5;

export const EditProfile: FC<{ profile: Profile }> = ({ profile }) => {
  const { data: bannerUrl } = api.asset.getBannerUrl.useQuery(
    {
      userId: profile.id,
    },
    {
      staleTime: FIVE_MINUTES_MS,
    },
  );

  const bannerUploadRef = useRef<ElementRef<typeof UploadButton>>(null);
  const avatarUploadRef = useRef<ElementRef<typeof UploadButton>>(null);

  return (
    <div>
      <Avatar
        className="rounded-none w-full h-[200px] hover:cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          bannerUploadRef.current!.click();
        }}
      >
        <AvatarImage
          src={bannerUrl}
          alt={`${profile.username}'s banner`}
          draggable={false}
        />
        <AvatarFallback className="rounded-none w-full h-[200px]" />
      </Avatar>
      <UploadButton
        className="hidden"
        ref={bannerUploadRef}
        resource="banners"
      />
      <UserAvatar
        className="w-[128px] h-[128px] mt-[-64px] ml-[10px] hover:cursor-pointer"
        user={profile}
        onClick={(e) => {
          e.preventDefault();
          avatarUploadRef.current!.click();
        }}
      />
      <UploadButton
        className="hidden"
        ref={avatarUploadRef}
        resource="avatars"
      />

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
      </div>
    </div>
  );
};
