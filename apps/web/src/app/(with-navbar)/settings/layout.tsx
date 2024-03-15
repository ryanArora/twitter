import { Button } from "@repo/ui/components/button";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { type FC, type ReactNode } from "react";

type NavbarLinkProps = {
  href: string;
  title: string;
};

const NavbarLink: FC<NavbarLinkProps> = ({ href, title }) => {
  return (
    <Button
      asChild
      className="w-full justify-start rounded-none px-4 py-6"
      type="button"
      variant="ghost"
    >
      <Link className="flex justify-between" href={href}>
        <span>{title}</span>
        <ChevronRightIcon className="p-0.5 text-primary/50" />
      </Link>
    </Button>
  );
};

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="h-screen w-[450px] border-l">
        <div className="border-b">
          <p className="m-4 text-xl font-semibold">Settings</p>
        </div>
        <nav className="flex flex-col overflow-y-auto">
          <NavbarLink href="/settings/account" title="Account" />
          <NavbarLink href="/settings/profile" title="Profile" />
          <NavbarLink
            href="/settings/privacy-and-safety"
            title="Privacy and safety"
          />
          <NavbarLink href="/settings/notifications" title="Notifications" />
        </nav>
      </div>
      <div className="h-screen w-[600px] border-x">{children}</div>
    </>
  );
}
