import "./globals.css";

import { Toaster } from "@repo/ui/components/toaster";
import { type Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { cache } from "react";
import { SessionProvider } from "./sessionContext";
import { TRPCReactProvider } from "@/trpc/react";
import { api } from "@/trpc/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Twitter",
  description: "A Twitter clone.",
};

const getHeaders = cache(async () => headers());

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await api.auth.getSession();

  return (
    <TRPCReactProvider headersPromise={getHeaders()}>
      <SessionProvider session={session}>
        <html className="w-screen h-screen" lang="en">
          <body
            className={`${inter.className} w-screen h-screen dark bg-background text-foreground overflow-x-hidden overflow-y-auto`}
          >
            <main className="w-screen h-screen">{children}</main>
            <Toaster />
          </body>
        </html>
      </SessionProvider>
    </TRPCReactProvider>
  );
}
