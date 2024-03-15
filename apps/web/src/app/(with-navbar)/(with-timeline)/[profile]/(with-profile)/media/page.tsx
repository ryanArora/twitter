"use client";

import { useProfile } from "../profileContext";
import { Timeline } from "@/app/(with-navbar)/(with-timeline)/timeline";


export default function MediaPage() {
  const profile = useProfile();

  return (
    <Timeline
      path="profileMedia"
      payload={{
        profile_userId: profile.id,
        tweetReplies_parentId: "",
      }}
    />
  );
}
