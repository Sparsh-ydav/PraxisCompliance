import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PraxisCompliance — Smart Permit Compliance",
  description:
    "AI-powered building permit compliance checker that learns from historical municipal review patterns.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
