import "./globals.css";

import type { Metadata } from "next";

import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";

import GoogleOAuthProvider from "@/provider/google-oauth-provider";

import Sidebar from "@/components/common/sidebar/sidebar";

export const metadata: Metadata = {
  title: "AutoRepl.ai",
  description: "Email response makes easy",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
        suppressHydrationWarning={true}
      >
        <GoogleOAuthProvider>
          <div className="overflow-hidden flex max-h-screen">
            <Sidebar />
            {children}
          </div>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
