import {
  TypographyH2,
  TypographyH3,
  TypographyP,
} from "@repo/ui/components/typography";
import { redirect } from "next/navigation";
import { api } from "@/trpc/server";

export default async function Home() {
  const session = await api.auth.getSession();
  if (!session) redirect("/login");

  return (
    <>
      <TypographyH2>Home Page</TypographyH2>
      <TypographyH3>Session</TypographyH3>
      <TypographyP>{session.user.username}</TypographyP>
    </>
  );
}
