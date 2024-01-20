"use client";

import { useProfile } from "./profileContext";
import { Timeline } from "../../timeline";
import { TimelineSourceProvider } from "../../timelineSourceContext";

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
