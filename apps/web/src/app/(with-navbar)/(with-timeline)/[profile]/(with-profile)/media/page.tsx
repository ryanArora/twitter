"use client";

import { useProfile } from "../profileContext";
import { Timeline } from "@/app/(with-navbar)/(with-timeline)/timeline";
import { TimelineSourceProvider } from "@/app/(with-navbar)/(with-timeline)/timelineSourceContext";

export default function MediaPage() {
  const profile = useProfile();

  return (
    <TimelineSourceProvider
      timelineSource={{ path: "media", payload: { profileId: profile.id } }}
    >
      <Timeline />
    </TimelineSourceProvider>
  );
}
