# Pelacak Leads — Next.js

Konversi dari halaman statis `legacy/pages/index.html` (HTML + CSS + JS dalam satu file) menjadi aplikasi **Next.js 16 (App Router) + TypeScript + Tailwind CSS 4**.

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm start
```

## Struktur folder

```
app/
  layout.tsx            # font (next/font), metadata, viewport
  page.tsx              # metadata halaman + JSON-LD (WebApplication & FAQPage)
  globals.css           # Tailwind + seluruh stylesheet asli (identik dengan HTML)
  icon.svg              # favicon
  opengraph-image.tsx   # OG image digenerate otomatis
  sitemap.ts / robots.ts
components/
  Dashboard.tsx         # provider + dynamic import (client only)
  App.tsx               # kerangka halaman (hero, view pipeline/laporan)
  Header.tsx            # brand + menu + tombol Tambah Lead
  MobileSidebar.tsx     # drawer navigasi (≤768px)
  StatsCards.tsx        # 4 kartu statistik
  LeadList.tsx          # pencarian, filter, kartu lead
  SidebarPanels.tsx     # panel Status Pipeline + Sumber Leads
  ReportView.tsx        # Rekap Leads Harian (tabel + kartu mobile)
  LeadFormModal.tsx     # form tambah/ubah lead + validasi
  ConfirmDeleteModal.tsx
  StatusManagerModal.tsx# kelola status pipeline
  Modal.tsx / Toast.tsx / Icons.tsx
lib/
  store.tsx             # state + aksi (React context)
  data.ts               # status bawaan, daftar sumber, data contoh
  format.ts             # format rupiah, tanggal, inisial, wa.me
  types.ts
legacy/                 # versi HTML asli (arsip, tidak ikut di-build)
```

## Perilaku yang dipertahankan dari versi asli

- Menu **Pipeline / Laporan Leads** tetap lewat hash URL (`#pipeline`, `#laporan`).
- Status pipeline bisa ditambah/diubah lewat **Kelola Status** dan tersimpan di `localStorage`.
- Lead masih disimpan **di memori** (seperti versi HTML) — data contoh kembali seperti semula setelah refresh.
- Ubah status ke *Closing* tanpa nilai / *Gagal* tanpa alasan otomatis membuka form untuk melengkapi.
- Desain, breakpoint, dan komponen visual identik dengan HTML asli.

## Perlu diisi manual

- `NEXT_PUBLIC_SITE_URL` (env) — dipakai untuk `metadataBase`, OG URL, sitemap, dan robots. Default-nya `http://localhost:3000`.
- Link WhatsApp tidak butuh pengaturan (otomatis dari nomor lead ke `wa.me`).
- Data contoh leads di `lib/data.ts` bisa diganti sesuai kebutuhan.
