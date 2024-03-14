"use client";

import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "@repo/ui/components/dialog";
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
import { PostTweet } from "./(with-timeline)/home/post-tweet";
import { NavbarLink } from "./navbar-link";
import { User } from "./user";
import { useSession } from "../sessionContext";

const NavbarLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const session = useSession();
  if (!session) redirect("/");

  return (
    <>
      <div className="w-[31.5%] flex justify-end">
        <div className="fixed flex flex-col justify-between h-full">
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="text-white bg-twitter-blue hover:bg-twitter-blue/90 transition-colors rounded-full w-full h-12 font-bold"
                    type="submit"
                  >
                    Tweet
                  </Button>
                </DialogTrigger>
                <DialogPortal>
                  <DialogOverlay>
                    <DialogContent className="w-[600px]">
                      <PostTweet
                        inputPlaceholder="What is happening?!"
                        submitButtonText="Tweet"
                        parentTweetId={null}
                        dontLinkToProfile
                      />
                    </DialogContent>
                  </DialogOverlay>
                </DialogPortal>
              </Dialog>
            </div>
          </div>
          <User user={session.user} />
        </div>
      </div>
      <div className="flex">
        <div className="w-[31.5%]"></div>
        {children}
      </div>
    </>
  );
};

export default NavbarLayout;
