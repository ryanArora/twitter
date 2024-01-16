import { TypographyH4 } from "@repo/ui/components/typography";
import Link from "next/link";
import { type FC, type ReactNode } from "react";

export const NavbarLink: FC<{
  icon: ReactNode;
  text: string;
  href: string;
}> = ({ icon, text, href }) => {
  return (
    <Link className="flex p-4 rounded-3xl hover:bg-accent w-fit" href={href}>
      <span className="mr-2">{icon}</span>
      <TypographyH4 className="ml-2">{text}</TypographyH4>
    </Link>
  );
};
