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
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PostTweet } from "./post-tweet";
import { Timeline } from "./timeline";
import { User } from "./user";
import { api } from "@/trpc/server";

export default async function Home() {
  const session = await api.auth.getSession();
  if (!session) redirect("/");

  return (
    <div className="h-screen w-screen flex">
      <div className="h-full flex justify-end w-[30%]">
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
            </nav>
            <div className="ml-2 mr-4 mt-4">
              <Button className="flex w-full rounded-2xl h-12">Tweet</Button>
            </div>
          </div>
          <div>
            <User user={session.user} />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden h-full flex w-[40%]">
        <div className="w-full h-full flex-1 overflow-y-scroll">
          <PostTweet user={session.user} />
          <Timeline />
        </div>
      </div>
      <div className="h-full flex w-[30%]">Hi</div>
    </div>
  );
}
