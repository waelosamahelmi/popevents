import type { Metadata } from "next";
import { Nunito, Poppins } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700", "900"], variable: "--font-poppins" });

export const metadata: Metadata = {
  title: "Pop Events Kuwait",
  description: "Bringing fresh ideas and exciting new events to Kuwait, designed for everyone to enjoy as a family day out.",
  keywords: ["events", "Kuwait", "festival", "coffee", "exhibition", "community"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
