import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Settings / Twitter",
};

export default function AccountSettingsPage() {
  return (
    <>
      <div className="border-b">
        <p className="m-4 text-xl font-semibold">Account</p>
      </div>
      <div className="m-4">
        <p>Account Settings</p>
      </div>
    </>
  );
}
