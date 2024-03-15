"use client";

import { useProfile } from "../../profileContext";
import { Timeline } from "@/app/(with-navbar)/(with-timeline)/timeline";

export default function MediaPage() {
  const profile = useProfile();

  return (
    <Timeline
      noTweetsMeta={{
        description: "Once they do, those tweets will show up here.",
        title: `@${profile.username} hasn’t tweeted media`,
      }}
      path="profileMedia"
      payload={{
        profile_userId: profile.id,
        tweetReplies_parentId: "",
      }}
    />
  );
}
