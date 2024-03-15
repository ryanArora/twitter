"use client";

import { Timeline } from "../../../timeline";
import { useProfile } from "../profileContext";

export default function ProfilePage() {
  const profile = useProfile();

  return (
    <Timeline
      path="profileHome"
      payload={{
        profile_userId: profile.id,
        tweetReplies_parentId: "",
      }}
    />
  );
}
