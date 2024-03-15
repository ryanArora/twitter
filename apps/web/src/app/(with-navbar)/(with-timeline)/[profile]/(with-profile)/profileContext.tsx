"use client";

import { type RouterOutputs } from "@repo/api";
import { type ReactNode, createContext, useContext } from "react";
import { api } from "@/trpc/react";

export type Profile = NonNullable<RouterOutputs["user"]["find"]>;

export const ProfileContext = createContext<Profile | null>(null);

export function ProfileProvider({
  children,
  profile,
}: {
  children: ReactNode;
  profile: Profile;
}) {
  const { data } = api.user.get.useQuery(
    { id: profile.id },
    {
      initialData: profile,
    },
  );

  return (
    <ProfileContext.Provider value={data}>{children}</ProfileContext.Provider>
  );
}

export function useProfile(): Profile {
  const profile = useContext(ProfileContext);

  if (!profile) {
    throw Error("No profile");
  }

  return profile;
}
