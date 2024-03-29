import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy and Safety Settings / Twitter",
};

export default function PrivacyAndSafetySettingsPage() {
  return (
    <>
      <div className="border-b">
        <p className="m-4 text-xl font-semibold">Privacy and Safety</p>
      </div>
      <div className="m-4">
        <p>Privacy and Safety Settings</p>
      </div>
    </>
  );
}
