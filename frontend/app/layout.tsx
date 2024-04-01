import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata : Metadata = {
  title: "Smart Purifier App",
  description: "ควบคุมและตรวจสอบอากาศบริสุทธิ์ด้วย Smart Purifier App",
  keywords: ["smart purifier", "air purifier", "nextjs", "seo"],
  openGraph: {
    title: "Smart Purifier App",
    description: "ควบคุมและตรวจสอบอากาศบริสุทธิ์ด้วย Smart Purifier App",
  },
  twitter: {
    title: "Smart Purifier App",
    description: "ควบคุมและตรวจสอบอากาศบริสุทธิ์ด้วย Smart Purifier App",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className , "h-screen")}>
        {children}</body>
    </html>
  );
}
