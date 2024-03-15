import { EditProfile } from "./edit-profile";
import { ProfileProvider } from "../../(with-timeline)/[profile]/(with-profile)/profileContext";
import { api } from "@/trpc/server";

export default async function ProfileSettingsPage() {
  const session = await api.auth.getSession();
  if (!session) return null;

  const profile = await api.user.find({ username: session.user.username });
  if (!profile) return null;

  return (
    <>
      <div className="border-b">
        <p className="m-4 text-xl font-semibold">Profile</p>
      </div>
      <ProfileProvider profile={profile}>
        <EditProfile />
      </ProfileProvider>
    </>
  );
}
