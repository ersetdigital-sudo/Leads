import type { Lead, Status } from "./types";

/* Status bawaan. Bisa ditambah/diubah lewat tombol "Kelola Status" (tersimpan di browser).
   tipe: "proses" = belum closing, "closing" = minta nilai transaksi, "gagal" = minta alasan */
export const DEFAULT_STATUS: Status[] = [
  { id: "belum", label: "Belum Closing", tipe: "proses", warna: "#b7791f" },
  { id: "closing", label: "Closing", tipe: "closing", warna: "#1f7a4d" },
];

export const STATUS_KEY = "pelacakLeads.status";

export const SUMBER_LIST = [
  "WhatsApp Langsung",
  "Iklan Meta",
  "Instagram",
  "TikTok",
  "Marketplace",
  "Referral",
  "Lainnya",
] as const;

/* Warna tiap sumber (dipakai di laporan) */
export const SUMBER_WARNA: Record<string, string> = {
  "WhatsApp Langsung": "#3f9b6a",
  "Iklan Meta": "#e0a93b",
  Instagram: "#c2557f",
  TikTok: "#2b2f33",
  Marketplace: "#e07a3b",
  Referral: "#3c6fc4",
  Lainnya: "#9aa19c",
};

/* Tanggal relatif terhadap hari ini supaya contoh "follow up lewat" selalu terlihat */
export function hariIni(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

/* Data contoh — dijalankan di client saja (komponen ini di-load dengan ssr: false) */
export function createSampleLeads(): Lead[] {
  return [
    { id: 1, nama: "Rina Kartika", wa: "081234567801", sumber: "Iklan Meta", status: "closing", nilai: 4750000, alasan: "", tanggalMasuk: hariIni(-21), followUp: "", catatan: "Paket premium 3 bulan, bayar lunas via transfer." },
    { id: 2, nama: "Budi Santoso", wa: "081398765402", sumber: "WhatsApp Langsung", status: "belum", nilai: 0, alasan: "", tanggalMasuk: hariIni(-9), followUp: hariIni(-2), catatan: "Minta penawaran harga grosir untuk 50 pcs." },
    { id: 3, nama: "Dewi Lestari", wa: "085712340003", sumber: "Instagram", status: "belum", nilai: 0, alasan: "", tanggalMasuk: hariIni(-1), followUp: hariIni(1), catatan: "Tanya stok warna sage via DM." },
    { id: 4, nama: "Agus Prasetyo", wa: "082145670004", sumber: "TikTok", status: "belum", nilai: 0, alasan: "", tanggalMasuk: hariIni(-4), followUp: hariIni(2), catatan: "Sudah dikirim katalog, menunggu balasan." },
    { id: 5, nama: "Siti Nurhaliza", wa: "081311220005", sumber: "Referral", status: "closing", nilai: 12500000, alasan: "", tanggalMasuk: hariIni(-30), followUp: "", catatan: "Referensi dari Bu Rina. Order untuk kantor." },
    { id: 6, nama: "Hendra Wijaya", wa: "087788990006", sumber: "Marketplace", status: "belum", nilai: 0, alasan: "", tanggalMasuk: hariIni(-15), followUp: "", catatan: "Bandingkan dengan toko lain di marketplace." },
    { id: 7, nama: "Putri Ayu Ramadhani", wa: "081277330007", sumber: "Iklan Meta", status: "belum", nilai: 0, alasan: "", tanggalMasuk: hariIni(-12), followUp: hariIni(-5), catatan: "Tertarik, tapi tunggu gajian tanggal 25." },
    { id: 8, nama: "Fajar Nugroho", wa: "085266440008", sumber: "Instagram", status: "closing", nilai: 2350000, alasan: "", tanggalMasuk: hariIni(-7), followUp: "", catatan: "Beli 2 set, kirim ke Bandung." },
    { id: 9, nama: "Maya Anggraini", wa: "089655110009", sumber: "TikTok", status: "belum", nilai: 0, alasan: "", tanggalMasuk: hariIni(0), followUp: "", catatan: "Komentar di video live, minta dihubungi." },
    { id: 10, nama: "Rizky Firmansyah", wa: "081955770010", sumber: "Lainnya", status: "belum", nilai: 0, alasan: "", tanggalMasuk: hariIni(-25), followUp: "", catatan: "Dapat dari pameran UMKM." },
    { id: 11, nama: "Indah Permatasari", wa: "082233880011", sumber: "Referral", status: "belum", nilai: 0, alasan: "", tanggalMasuk: hariIni(-3), followUp: hariIni(-1), catatan: "Minta jadwal demo produk hari Kamis." },
    { id: 12, nama: "Yoga Saputra", wa: "081366990012", sumber: "WhatsApp Langsung", status: "closing", nilai: 6800000, alasan: "", tanggalMasuk: hariIni(-18), followUp: "", catatan: "Repeat order, minta invoice atas nama CV." },
  ];
}
