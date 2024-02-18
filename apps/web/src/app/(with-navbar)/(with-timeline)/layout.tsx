import { type ReactNode } from "react";

export default function WithTimelineLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="h-full w-[600px] overflow-y-none">{children}</div>;
}
