"use client";

import { useProfile } from "../profileContext";
import { Timeline } from "@/app/(with-navbar)/(with-timeline)/timeline";
import { TimelineSourceProvider } from "@/app/(with-navbar)/(with-timeline)/timelineSourceContext";

export default function LikesPage() {
  const profile = useProfile();

  return (
    <TimelineSourceProvider
      timelineSource={{ path: "likes", payload: { profileId: profile.id } }}
    >
      <Timeline />
    </TimelineSourceProvider>
  );
}
