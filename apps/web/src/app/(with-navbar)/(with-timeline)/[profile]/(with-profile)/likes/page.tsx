"use client";

import { useProfile } from "../profileContext";
import { Timeline } from "@/app/(with-navbar)/(with-timeline)/timeline";

export default function LikesPage() {
  const profile = useProfile();

  return (
    <Timeline
      path="profileLikes"
      payload={{
        profile_userId: profile.id,
        tweetReplies_parentId: "",
      }}
    />
  );
}
