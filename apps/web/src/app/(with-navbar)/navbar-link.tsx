import { TypographyH4 } from "@repo/ui/components/typography";
import Link from "next/link";
import { type FC, type ReactNode } from "react";

export const NavbarLink: FC<{
  icon: ReactNode;
  text: string;
  href: string;
}> = ({ icon, text, href }) => {
  return (
    <Link className="flex w-fit rounded-3xl p-4 hover:bg-accent" href={href}>
      <span className="mr-2">{icon}</span>
      <TypographyH4 className="ml-2">{text}</TypographyH4>
    </Link>
  );
};
