"use client";

import { type RouterOutputs } from "@repo/api";
import { type ReactNode, createContext, useContext } from "react";

export type Profile = NonNullable<RouterOutputs["user"]["find"]>;

export const ProfileContext = createContext<Profile | null>(null);

export function ProfileProvider({
  profile,
  children,
}: {
  profile: Profile | null;
  children: ReactNode;
}) {
  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): Profile {
  const profile = useContext(ProfileContext);

  if (!profile) {
    throw Error("No profile");
  }

  return profile;
}
