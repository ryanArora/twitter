"use client";

import { useProfile } from "../profileContext";
import { Timeline } from "@/app/(with-navbar)/(with-timeline)/timeline";

export default function LikesPage() {
  const profile = useProfile();

  return <Timeline path="likes" payload={{ profileId: profile.id }} />;
}
