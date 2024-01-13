import { type Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import { cache } from "react";
import { TRPCReactProvider } from "@/trpc/react";

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
        <body className={inter.className}>{children}</body>
      </html>
    </TRPCReactProvider>
  );
}
