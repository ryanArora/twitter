import { redirect } from "next/navigation";
import { type ReactNode } from "react";
import { api } from "@/trpc/server";

export default async function Login({ children }: { children: ReactNode }) {
  const session = await api.auth.getSession();
  if (session) redirect("/home");

  return <>{children}</>;
}
