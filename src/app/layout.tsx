import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NC'ELEC | \u00c9lectricien en Seine-et-Marne",
  description:
    "Installation \u00e9lectrique, d\u00e9pannage, r\u00e9novation, mise aux normes et interventions rapides en Seine-et-Marne.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
      >
        {children}
      </body>
    </html>
  );
}
