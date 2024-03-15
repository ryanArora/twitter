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
import React, { type FC, type ReactNode, useState } from "react";
import { PostTweet } from "./(with-timeline)/home/post-tweet";
import { NavbarLink } from "./navbar-link";
import { User } from "./user";
import { useSession } from "../sessionContext";

const NavbarLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const session = useSession();
  if (!session) redirect("/");

  return (
    <>
      <div className="flex w-[31.5%] justify-end">
        <div className="fixed flex h-full flex-col justify-between">
          <div>
            <div className="w-fit">
              <Link href="/home">
                <div className="rounded-full p-3 hover:bg-accent">
                  <Image
                    alt="twitter logo"
                    height={42}
                    src="/twitter.svg"
                    width={42}
                  />
                </div>
              </Link>
            </div>
            <nav className="w-fit">
              <NavbarLink href="/home" icon={<HomeIcon />} text="Home" />
              <NavbarLink
                href="/notifications"
                icon={<BellIcon />}
                text="Notifications"
              />
              <NavbarLink
                href="/messages"
                icon={<MailIcon />}
                text="Messages"
              />
              <NavbarLink
                href="/bookmarks"
                icon={<BookmarkIcon />}
                text="Bookmarks"
              />
              <NavbarLink
                href={`/${session.user.username}`}
                icon={<UserIcon />}
                text="Profile"
              />
              <NavbarLink
                href="/settings"
                icon={<SettingsIcon />}
                text="Settings"
              />
            </nav>
            <div className="ml-2 mr-4 mt-4">
              <Dialog onOpenChange={setOpen} open={open}>
                <DialogTrigger asChild>
                  <Button
                    className="h-12 w-full rounded-full bg-twitter-blue font-bold text-white transition-colors hover:bg-twitter-blue/90"
                    type="submit"
                  >
                    Tweet
                  </Button>
                </DialogTrigger>
                <DialogPortal>
                  <DialogOverlay>
                    <DialogContent className="w-[600px]">
                      <PostTweet
                        dontLinkToProfile
                        inputPlaceholder="What is happening?!"
                        onSuccess={() => {
                          setOpen(false);
                        }}
                        parentTweetId={null}
                        submitButtonText="Tweet"
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
