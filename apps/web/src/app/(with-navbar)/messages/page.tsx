import { type Metadata } from "next";
import { Header } from "../header";

export const metadata: Metadata = {
  title: "Messages / Twitter",
};

export default function MessagesPage() {
  return (
    <div className="flex">
      <div className="h-full min-h-screen w-[388px] border-x">
        <Header title="Messages" />
      </div>
      <div className="h-full min-h-screen w-[600px] border-x"></div>
    </div>
  );
}
