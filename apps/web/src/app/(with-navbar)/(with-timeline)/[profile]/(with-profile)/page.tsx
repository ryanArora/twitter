"use client";

import { useProfile } from "./profileContext";
import { Timeline } from "../../timeline";

export default function ProfilePage() {
  const profile = useProfile();

  return <Timeline path="profile" payload={{ profileId: profile.id }} />;
}
