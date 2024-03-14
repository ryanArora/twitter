"use client";

import { useProfile } from "../profileContext";
import { Timeline } from "@/app/(with-navbar)/(with-timeline)/timeline";

export default function MediaPage() {
  const profile = useProfile();

  return <Timeline path="media" payload={{ profileId: profile.id }} />;
}
