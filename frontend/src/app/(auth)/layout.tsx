import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sign In — SSB PREP by SSB NEXTGEN",
  description: "Sign in to your SSB preparation account to access AI-powered training modules.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} min-h-screen bg-[#020617] text-[#f8fafc] flex`}>
      {children}
    </div>
  );
}
