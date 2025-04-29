import "./globals.css";

import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NextJS Authentication App",
  description: "NextJS app which demonstrates the authentication.",
};

import GlobalNavbar from '@/components/GlobalNavbar';
import SessionExpiredToast from '@/components/SessionExpiredToast';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white min-h-screen`}> 
        <GlobalNavbar />
        <SessionExpiredToast />
        {children}
      </body>
    </html>
  );
}
