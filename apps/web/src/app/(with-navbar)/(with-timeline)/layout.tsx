import { type ReactNode } from "react";

export default function WithTimelineLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="overflow-y-none h-full w-[600px]">{children}</div>;
}
