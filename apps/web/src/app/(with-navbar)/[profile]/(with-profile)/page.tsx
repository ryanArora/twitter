"use client";

import { useProfile } from "./profileContext";
import { Timeline } from "../../timeline/timeline";
import { TimelineSourceProvider } from "../../timeline/timelineSourceContext";

export default function ProfilePage() {
  const profile = useProfile();

  return (
    <TimelineSourceProvider
      timelineSource={{ path: "profile", payload: { profileId: profile.id } }}
    >
      <Timeline />
    </TimelineSourceProvider>
  );
}
