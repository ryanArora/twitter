"use client";

import { Button } from "@repo/ui/components/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FC } from "react";

export type HeaderProps = {
  title: string;
  subtitle?: string;
};

export const Header: FC<HeaderProps> = ({ title, subtitle }) => {
  const router = useRouter();

  return (
    <div className="sticky top-0 flex h-[64px] max-h-[64px] min-h-[64px] items-center bg-background">
      <Button
        className="mx-2 rounded-full p-0"
        type="button"
        variant="ghost"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mx-1.5" />
      </Button>
      <div className="mx-4 my-2">
        <p className="text-xl font-bold">{title}</p>
        <p className="text-sm text-primary/50">{subtitle}</p>
      </div>
    </div>
  );
};
