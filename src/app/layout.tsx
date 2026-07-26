import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Engineer OS | The B.Tech Operating System",
  description: "Engineer OS — Your AI-powered Operating System for B.Tech. Syllabus, Roadmaps, Jobs, and Tasks in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className={`${inter.className} text-slate-900 dark:text-white bg-slate-50 dark:bg-[#0f172a]`}>
        {children}
      </body>
    </html>
  );
}
