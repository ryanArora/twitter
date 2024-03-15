import { Button } from "@repo/ui/components/button";
import { TypographyH1, TypographyH2 } from "@repo/ui/components/typography";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { api } from "@/trpc/server";

export default async function Landing() {
  const session = await api.auth.getSession();
  if (session) redirect("/home");

  return (
    <div className="flex h-screen">
      <div className="flex h-screen w-[50%] items-center justify-center">
        <Image
          alt="twitter logo"
          className=""
          height={550}
          src="/twitter.svg"
          width={550}
        />
      </div>
      <div className="flex h-screen w-[50%] items-center">
        <div className="ml-16">
          <TypographyH1 className="mb-16">Happening now</TypographyH1>
          <TypographyH2 className="mb-4">Join today.</TypographyH2>
          <div>
            <div>
              <Button asChild className="my-4 flex grow">
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
            <div>
              <Button asChild className="my-4 flex grow" variant="outline">
                <Link href="/login">Log in</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
