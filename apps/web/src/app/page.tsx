import { Button } from "@repo/ui/components/button";
import {
  TypographyH1,
  TypographyH2,
  TypographyH4,
} from "@repo/ui/components/typography";
import Image from "next/image";
import Link from "next/link";

export default function Landing() {
  return (
    <div className="flex h-screen">
      <div className="flex items-center justify-center w-[50%] h-screen">
        <Image
          className=""
          alt="twitter logo"
          src="/twitter.svg"
          width={550}
          height={550}
        />
      </div>
      <div className="w-[50%] h-screen flex items-center">
        <div className="ml-16">
          <TypographyH1 className="mb-16">Happening now</TypographyH1>
          <TypographyH2 className="mb-4">Join today.</TypographyH2>
          <div>
            <div>
              <Button className="my-4 flex grow" asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
            <div>
              <Button variant="outline" className="my-4 flex grow" asChild>
                <Link href="/login">Log in</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
