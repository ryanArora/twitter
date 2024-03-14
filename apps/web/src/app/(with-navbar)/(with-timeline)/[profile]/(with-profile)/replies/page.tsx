"use client";

import { useProfile } from "../profileContext";
import { Timeline } from "@/app/(with-navbar)/(with-timeline)/timeline";

export default function RepliesPage() {
  const profile = useProfile();

  return <Timeline path="replies" payload={{ profileId: profile.id }} />;
}
