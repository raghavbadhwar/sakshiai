import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SakshiAI — Autonomous Public Works DPR, Sanction & Audit Agent",
  description:
    "Sovereign Public Works FinOps copilot for MPLADS FY 2026-31, e-SAKSHI sanction tracking, and cryptographic Utilization Certificate auditing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased selection:bg-[#fdf1e8] selection:text-[#111d35]">
        {children}
      </body>
    </html>
  );
}
