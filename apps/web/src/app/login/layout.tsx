import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";
import { api } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Login / Twitter",
};

export default async function Login({ children }: { children: ReactNode }) {
  const session = await api.auth.getSession();
  if (session) redirect("/home");

  return <>{children}</>;
}
