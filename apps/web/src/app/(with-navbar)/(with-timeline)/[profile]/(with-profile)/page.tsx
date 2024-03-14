"use client";

import { useProfile } from "./profileContext";
import { Timeline } from "../../timeline";

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
