import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Engineer OS | The B.Tech Operating System",
  description: "Engineer OS — Your AI-powered Operating System for B.Tech. Syllabus, Roadmaps, Jobs, Startups & Code Analytics.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Engineer OS",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className={`${inter.className} text-slate-900 dark:text-white bg-[#0d0d12]`}>
        {children}
      </body>
    </html>
  );
}
