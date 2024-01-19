"use client";

import { useProfile } from "./profileContext";
import { Timeline } from "../../timeline/timeline";
import { TimelineSourceProvider } from "../../timeline/timelineSourceContext";

export default function ProfilePage() {
  const profile = useProfile();

  return (
    <div>
      <TimelineSourceProvider
        timelineSource={{ path: "profile", payload: { authorId: profile.id } }}
      >
        <Timeline />
      </TimelineSourceProvider>
    </div>
  );
}
