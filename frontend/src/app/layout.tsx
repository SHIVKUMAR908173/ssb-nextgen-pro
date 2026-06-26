import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import AppShell from "@/components/layout/AppShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SSB PREP by SSB NEXTGEN – AI Virtual Interview & Psychology Tests",
  description: "Professional SSB preparation platform with AI Virtual Interview, Psychology Tests, and more.",
  openGraph: {
    title: "SSB PREP by SSB NEXTGEN",
    description: "Professional SSB preparation platform with AI Virtual Interview, Psychology Tests, and more.",
    type: "website",
    locale: "en_IN",
    siteName: "SSB NEXTGEN",
  },
  twitter: {
    card: "summary_large_image",
    title: "SSB PREP by SSB NEXTGEN",
    description: "Professional SSB preparation platform with AI Virtual Interview, Psychology Tests, and more.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#020617",
};

import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#020617] text-[#f8fafc]`}>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
