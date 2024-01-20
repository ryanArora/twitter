import { type ReactNode } from "react";

export default function FollowsLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <p>Follows Layout</p>
      {children}
    </div>
  );
}
