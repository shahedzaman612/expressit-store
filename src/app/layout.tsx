import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/componants/ThemeToggle"; // 👈 Add this

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ExpressIT Store",
  description: "Build your online store fast",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]`}
      >
        <header className="border-b bg-white dark:bg-gray-900 p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            🛍️ ExpressIT Store
          </h1>
          <ThemeToggle />
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
