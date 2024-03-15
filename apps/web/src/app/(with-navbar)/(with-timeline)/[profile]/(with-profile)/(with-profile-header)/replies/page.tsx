"use client";

import { useProfile } from "../../profileContext";
import { Timeline } from "@/app/(with-navbar)/(with-timeline)/timeline";

export default function RepliesPage() {
  const profile = useProfile();

  return (
    <Timeline
      noTweetsMeta={{
        description: "When they do, their tweets will show up here.",
        title: `@${profile.username} hasn’t tweeted replies`,
      }}
      path="profileReplies"
      payload={{
        profile_userId: profile.id,
        tweetReplies_parentId: "",
      }}
    />
  );
}
