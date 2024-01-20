"use client";

import { useProfile } from "../profileContext";
import { Timeline } from "@/app/(with-navbar)/timeline/timeline";
import { TimelineSourceProvider } from "@/app/(with-navbar)/timeline/timelineSourceContext";

export default function RepliesPage() {
  const profile = useProfile();

  return (
    <TimelineSourceProvider
      timelineSource={{ path: "replies", payload: { profileId: profile.id } }}
    >
      <Timeline />
    </TimelineSourceProvider>
  );
}
