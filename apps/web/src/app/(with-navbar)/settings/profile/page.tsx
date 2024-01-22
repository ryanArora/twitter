import { EditProfile } from "./edit-profile";
import { api } from "@/trpc/server";

export default async function ProfileSettingsPage() {
  const session = await api.auth.getSession();
  if (!session) return null;

  const profile = await api.user.find({ username: session.user.username });
  if (!profile) return null;

  return (
    <>
      <div className="border-b">
        <p className="text-xl m-4 font-semibold">Profile</p>
      </div>
      <EditProfile profile={profile} />
    </>
  );
}
