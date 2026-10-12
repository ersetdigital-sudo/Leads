import { Dashboard } from "@/components/Dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pelacak Leads",
  alternateName: "Pelacak Leads · Pipeline Penjualan",
  description:
    "Dashboard untuk memantau lead penjualan: pipeline, follow up harian, sumber leads, dan rekap closing harian.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: "id",
  offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
  featureList: [
    "Pipeline leads dengan status yang bisa dikustomisasi",
    "Pencarian dan filter status serta sumber leads",
    "Pengingat follow up harian",
    "Rekap leads dan closing per kanal setiap hari",
  ],
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Apa itu Pelacak Leads?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pelacak Leads adalah dashboard penjualan untuk memantau setiap lead dari chat pertama sampai closing, lengkap dengan pipeline status, pengingat follow up, dan rekap harian per kanal.",
      },
    },
    {
      "@type": "Question",
      name: "Bagaimana cara menambah lead baru?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Klik tombol Tambah Lead, isi nama dan nomor WhatsApp, pilih sumber serta status, lalu simpan. Nomor WhatsApp bisa langsung dibuka di wa.me.",
      },
    },
    {
      "@type": "Question",
      name: "Bagaimana laporan leads dihitung?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Laporan Leads dihitung otomatis dari data di Pipeline, dikelompokkan berdasarkan tanggal masuk dan sumber, lalu diringkas menjadi jumlah leads, closing, dan nilai closing.",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
      <Dashboard />
    </>
  );
}
