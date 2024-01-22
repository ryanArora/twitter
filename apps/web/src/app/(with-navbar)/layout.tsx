"use client";

import { Button } from "@repo/ui/components/button";
import {
  BellIcon,
  BookmarkIcon,
  HomeIcon,
  MailIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { type FC, type ReactNode } from "react";
import { NavbarLink } from "./navbar-link";
import { User } from "./user";
import { useSession } from "../sessionContext";

const NavbarLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const session = useSession();
  if (!session) redirect("/");

  return (
    <div className="h-screen w-screen flex">
      <div className="h-full w-[31.5%] flex justify-end">
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="w-fit">
              <Link href="/home">
                <div className="p-3 hover:bg-accent rounded-full">
                  <Image
                    src="/twitter.svg"
                    alt="twitter logo"
                    width={42}
                    height={42}
                  />
                </div>
              </Link>
            </div>
            <nav className="w-fit">
              <NavbarLink icon={<HomeIcon />} href="/home" text="Home" />
              <NavbarLink
                icon={<BellIcon />}
                href="/notifications"
                text="Notifications"
              />
              <NavbarLink
                icon={<MailIcon />}
                href="/messages"
                text="Messages"
              />
              <NavbarLink
                icon={<BookmarkIcon />}
                href="/bookmarks"
                text="Bookmarks"
              />
              <NavbarLink
                icon={<UserIcon />}
                href={`/${session.user.username}`}
                text="Profile"
              />
              <NavbarLink
                icon={<SettingsIcon />}
                href="/settings"
                text="Settings"
              />
            </nav>
            <div className="ml-2 mr-4 mt-4">
              <Button className="flex w-full rounded-2xl h-12">Tweet</Button>
            </div>
          </div>
          <User user={session.user} />
        </div>
      </div>
      {children}
    </div>
  );
};

export default NavbarLayout;
