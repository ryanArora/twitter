import { type ReactNode } from "react";
import { LayoutClient } from "./layout-client";
import { ProfileProvider } from "./profileContext";
import { api } from "@/trpc/server";

export default async function ProfileLayout({
  params,
  children,
}: {
  params: { profile: string };
  children: ReactNode;
}) {
  const profile = await api.user.find({
    username: params.profile,
  });

  if (profile === null) {
    return (
      <div>
        <p>Page not found</p>
      </div>
    );
  }

  return (
    <ProfileProvider profile={profile}>
      <LayoutClient>{children}</LayoutClient>
    </ProfileProvider>
  );
}