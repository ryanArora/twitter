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
    <div className="flex items-center h-[64px] max-h-[64px] min-h-[64px] sticky top-0 bg-background">
      <Button
        className="p-0 mx-2 rounded-full"
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
