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
      className="w-full px-4 py-6 rounded-none justify-start"
      asChild
      type="button"
      variant="ghost"
    >
      <Link className="flex justify-between" href={href}>
        <span className="">{title}</span>
        <ChevronRightIcon className="text-primary/50 p-0.5" />
      </Link>
    </Button>
  );
};

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="w-[450px] border-l">
        <div className="border-b">
          <p className="text-xl m-4 font-semibold">Settings</p>
        </div>
        <nav className="h-full flex flex-col">
          <NavbarLink href="/settings/account" title="Account" />

          <NavbarLink href="/settings/profile" title="Profile" />
          <NavbarLink
            href="/settings/privacy-and-safety"
            title="Privacy and safety"
          />
          <NavbarLink href="/settings/notifications" title="Notifications" />
        </nav>
      </div>
      <div className="w-[600px] h-full border-x">{children}</div>
    </>
  );
}
