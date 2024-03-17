"use client";

import { Button } from "@repo/ui/components/button";
import Link from "next/link";
import { type ReactNode } from "react";
import { useProfile } from "../profileContext";
import { Header } from "@/app/(with-navbar)/header";

export default function FollowsLayout({ children }: { children: ReactNode }) {
  const profile = useProfile();

  return (
    <div className="h-full min-h-screen border-x">
      <Header subtitle={`@${profile.username}`} title={profile.name} />
      <nav className="flex justify-around border-b">
        <Button
          asChild
          className="grow rounded-none py-6 text-primary/50 hover:text-primary/50"
          variant="ghost"
        >
          <Link href={`/${profile.username}/followers`} replace>
            Followers
          </Link>
        </Button>
        <Button
          asChild
          className="grow rounded-none py-6 text-primary/50 hover:text-primary/50"
          variant="ghost"
        >
          <Link href={`/${profile.username}/following`} replace>
            Following
          </Link>
        </Button>
      </nav>
      {children}
    </div>
  );
}
