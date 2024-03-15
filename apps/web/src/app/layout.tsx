import { Toaster } from "@repo/ui/components/toaster";
import { type Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { cache } from "react";
import { SessionProvider } from "./sessionContext";
import { TRPCReactProvider } from "@/trpc/react";
import { api } from "@/trpc/server";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  description: "A Twitter clone.",
  title: "Twitter",
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
        <html className="h-screen w-screen" lang="en">
          <body
            className={`${inter.className} dark h-screen w-screen overflow-y-auto overflow-x-hidden bg-background text-foreground`}
          >
            <main className="h-screen w-screen">{children}</main>
            <Toaster />
          </body>
        </html>
      </SessionProvider>
    </TRPCReactProvider>
  );
}
