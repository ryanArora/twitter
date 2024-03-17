import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications Settings / Twitter",
};

export default function NotificationsSettingsPage() {
  return (
    <>
      <div className="border-b">
        <p className="m-4 text-xl font-semibold">Notifications</p>
      </div>
      <div className="m-4">
        <p>Notifications Settings</p>
      </div>
    </>
  );
}
