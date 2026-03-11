import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shawties Bookworms Reading Challenge",
  description: "Summer reading challenge tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SiteHeader />
        {children}
        <footer className="text-center text-xs text-gray-400 py-8 mt-4 border-t border-gray-100 space-y-1">
          <p>© {new Date().getFullYear()} Shawties Bookworms</p>
          {process.env.NEXT_PUBLIC_BUILD_TIME && (
            <p className="text-gray-300">
              deployed {new Date(process.env.NEXT_PUBLIC_BUILD_TIME).toLocaleString("en-US", {
                month: "short", day: "numeric", year: "numeric",
                hour: "numeric", minute: "2-digit", timeZoneName: "short",
              })}
            </p>
          )}
        </footer>
      </body>
    </html>
  );
}
