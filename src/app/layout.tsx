import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "MysteriaHub — The world's mysteries, waiting for you to solve them",
  description:
    "Investigate. Compete. Conquer. Solve curated escape-game mysteries, rank up, and earn badges.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body antialiased min-h-screen bg-mystery-dark">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
