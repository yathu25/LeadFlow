import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LeadFlow – AIDD Screening Tracker",
  description: "PI-facing dashboard for LeadFactory-style screening requests",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

