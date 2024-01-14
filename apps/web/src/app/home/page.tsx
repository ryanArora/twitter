import { Button } from "@repo/ui/components/button";
import { TypographyH4 } from "@repo/ui/components/typography";
import {
  BellIcon,
  BookmarkIcon,
  HomeIcon,
  MailIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { User } from "./user";
import { api } from "@/trpc/server";

export default async function Home() {
  const session = await api.auth.getSession();
  if (!session) redirect("/");

  return (
    <div className="h-screen w-screen flex">
      <div className="h-full flex justify-end w-[30%]">
        <div className="flex flex-col justify-between h-full w-fit mr-16">
          <div className="w-fit">
            <Link
              className="flex p-4 rounded-3xl hover:bg-accent w-fit"
              href="/home"
            >
              <HomeIcon className="mr-2" />
              <TypographyH4 className="ml-2">Home</TypographyH4>
            </Link>
            <Link
              className="flex p-4 rounded-3xl hover:bg-accent w-fit"
              href="/notifications"
            >
              <BellIcon className="mr-2" />
              <TypographyH4 className="ml-2">Notifications</TypographyH4>
            </Link>
            <Link
              className="flex p-4 rounded-3xl hover:bg-accent w-fit"
              href="/messages"
            >
              <MailIcon className="mr-2" />
              <TypographyH4 className="ml-2">Messages</TypographyH4>
            </Link>
            <Link
              className="flex p-4 rounded-3xl hover:bg-accent w-fit"
              href="/bookmarks"
            >
              <BookmarkIcon className="mr-2" />
              <TypographyH4 className="ml-2">Bookmarks</TypographyH4>
            </Link>
            <Link
              className="flex p-4 rounded-3xl hover:bg-accent w-fit"
              href="/profile"
            >
              <UserIcon className="mr-2" />
              <TypographyH4 className="ml-2">Profile</TypographyH4>
            </Link>
            <Link
              className="flex p-4 rounded-3xl hover:bg-accent w-fit"
              href="/settings"
            >
              <SettingsIcon className="mr-2" />
              <TypographyH4 className="ml-2">Settings</TypographyH4>
            </Link>
          </div>
          <div>
            <User user={session.user} />
          </div>
        </div>
      </div>
      <div className="h-full flex w-[40%]">
        <div className="w-full h-16">Hello, world!</div>
      </div>
      <div className="h-full flex w-[30%]">Hi</div>
    </div>
  );
}
