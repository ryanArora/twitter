"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { CalendarRangeIcon, Edit2Icon } from "lucide-react";
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
      <div className="relative w-full h-[200px]">
        <Avatar className="block w-full h-full rounded-none">
          <AvatarImage
            src={bannerUrl}
            alt={`${profile.username}'s banner`}
            draggable={false}
          />
          <AvatarFallback className="rounded-none w-full h-full" />
        </Avatar>
        <div
          className="absolute bottom-0 w-full h-full transition-opacity opacity-0 hover:cursor-pointer hover:opacity-[50%] bg-black flex justify-center items-center"
          onClick={(e) => {
            e.preventDefault();
            bannerUploadRef.current!.click();
          }}
        >
          <Edit2Icon fill="white" />
        </div>
        <UploadButton
          className="hidden"
          ref={bannerUploadRef}
          resource="banners"
        />
      </div>
      <div className="relative w-[128px] h-[128px] ml-[10px] mt-[-64px] rounded-full">
        <UserAvatar
          className="w-full h-full hover:cursor-pointer"
          user={profile}
          onClick={(e) => {
            e.preventDefault();
            avatarUploadRef.current!.click();
          }}
        />
        <div
          className="absolute bottom-0 w-full h-full rounded-full transition-opacity opacity-0 hover:cursor-pointer hover:opacity-[50%] bg-black flex justify-center items-center"
          onClick={(e) => {
            e.preventDefault();
            avatarUploadRef.current!.click();
          }}
        >
          <Edit2Icon fill="white" />
        </div>
        <UploadButton
          className="hidden"
          ref={avatarUploadRef}
          resource="avatars"
        />
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
      </div>
    </div>
  );
};
