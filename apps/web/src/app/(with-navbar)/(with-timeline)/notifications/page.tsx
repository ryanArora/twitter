import { type Metadata } from "next";
import { Header } from "../../header";

export const metadata: Metadata = {
  title: "Notifications / Twitter",
};

export default function NotificationsPage() {
  return (
    <div className="h-full min-h-screen border-x">
      <Header title="Notifications" />
    </div>
  );
}
