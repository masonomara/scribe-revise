import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";

const dmsans = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ScribeRevise | AI-Powered Revised Messages",
  metadataBase: new URL("https://scriberevise.com/"),
  icons: {
    icon: "icon.ico",
  },
  description:
    "ScribeRevise | AI-powered web app delivering expert suggestions and revised messages for professional emails, academic papers, marketing content, and more.",
  openGraph: {
    title: "ScribeRevise | AI-Powered Revised Messages",
    description:
      "ScribeRevise | AI-powered web app delivering expert suggestions and revised messages for professional emails, academic papers, marketing content, and more.",
    images: [
      {
        url: "/social.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={dmsans.className}>
        <Header />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
