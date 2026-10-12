export type StatusTipe = "proses" | "closing" | "gagal";

export interface Status {
  id: string;
  label: string;
  tipe: StatusTipe;
  warna: string;
}

export interface Lead {
  id: number;
  nama: string;
  wa: string;
  sumber: string;
  status: string;
  nilai: number;
  alasan: string;
  tanggalMasuk: string;
  followUp: string;
  catatan: string;
}

export type View = "pipeline" | "laporan";

export interface ToastItem {
  id: number;
  msg: string;
  leaving: boolean;
}

export interface LeadDraft {
  nama: string;
  wa: string;
  sumber: string;
  status: string;
  nilai: string;
  alasan: string;
  followUp: string;
  catatan: string;
}
