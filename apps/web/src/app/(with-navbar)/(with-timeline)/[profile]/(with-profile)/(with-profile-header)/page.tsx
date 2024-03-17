"use client";

import { Timeline } from "../../../timeline";
import { useProfile } from "../profileContext";

export default function ProfilePage() {
  const profile = useProfile();

  return (
    <Timeline
      noTweetsMeta={{
        description: "When they do, their tweets will show up here.",
        title: `@${profile.username} hasn’t tweeted`,
      }}
      path="profileHome"
      payload={{
        profile_userId: profile.id,
        tweetReplies_parentId: "",
      }}
    />
  );
}
