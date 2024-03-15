import { type ReactNode } from "react";
import { ProfileProvider } from "./profileContext";
import { api } from "@/trpc/server";

export default async function ProfileLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { profile: string };
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

  return <ProfileProvider profile={profile}>{children}</ProfileProvider>;
}
