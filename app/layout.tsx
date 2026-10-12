import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-sora",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Pelacak Leads · Pipeline Penjualan",
  description:
    "Pantau setiap lead dari chat sampai closing. Pipeline penjualan, follow up harian, laporan leads per kanal, dan nilai closing — semua dalam satu dashboard.",
  keywords: [
    "pelacak leads",
    "pipeline penjualan",
    "CRM sederhana",
    "follow up leads",
    "laporan leads",
    "sales tracker",
    "WhatsApp leads",
  ],
  applicationName: "Pelacak Leads",
  authors: [{ name: "Pelacak Leads" }],
  category: "business",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Pelacak Leads",
    title: "Pelacak Leads · Pipeline Penjualan",
    description:
      "Pantau setiap lead dari chat sampai closing. Pipeline penjualan, follow up harian, dan laporan leads per kanal dalam satu dashboard.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pelacak Leads · Pipeline Penjualan",
    description:
      "Pantau setiap lead dari chat sampai closing. Pipeline penjualan, follow up harian, dan laporan leads per kanal.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#133f33",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${sora.variable} ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
