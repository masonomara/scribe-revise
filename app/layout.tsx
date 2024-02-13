import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Analytics } from "@vercel/analytics/react";
import Head from "next/head";
import { Metadata } from "next";

const dmsans = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ScribeRevise | AI-Powered Revised Messages",
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
      <Head>
        <title>ScribeRevise | AI-Powered Revised Messages</title>
        <meta
          name="description"
          content="ScribeRevise | AI-powered web app delivering expert suggestions and revised messages for professional emails, academic papers, marketing content, and more."
        />

        <meta property="og:url" content="https://scriberevise.com" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="ScribeRevise | AI-Powered Revised Messages"
        />
        <meta
          property="og:description"
          content="ScribeRevise | AI-powered web app delivering expert suggestions and revised messages for professional emails, academic papers, marketing content, and more."
        />
        <meta property="og:image" content="/social.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="scriberevise.com" />
        <meta property="twitter:url" content="https://scriberevise.com" />
        <meta
          name="twitter:title"
          content="ScribeRevise | AI-Powered Revised Messages"
        />
        <meta
          name="twitter:description"
          content="ScribeRevise | AI-powered web app delivering expert suggestions and revised messages for professional emails, academic papers, marketing content, and more."
        />
        <meta name="twitter:image" content="/social.png" />
      </Head>
      <body className={dmsans.className}>
        <Header />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
