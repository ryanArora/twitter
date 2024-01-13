import { Toaster } from "@repo/ui/components/toaster";
import { type Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { cache } from "react";
import { TRPCReactProvider } from "@/trpc/react";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Twitter",
  description: "A Twitter clone.",
};

const getHeaders = cache(async () => headers());

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TRPCReactProvider headersPromise={getHeaders()}>
      <html lang="en">
        <body className={inter.className}>
          <main>{children}</main>
          <Toaster />
        </body>
      </html>
    </TRPCReactProvider>
  );
}
