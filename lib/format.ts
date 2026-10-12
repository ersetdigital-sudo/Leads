export const todayStr = (): string => new Date().toISOString().slice(0, 10);

export const rupiah = (n: number): string => "Rp" + Number(n || 0).toLocaleString("id-ID");

export const rupiahSingkat = (n: number): string => {
  const v = Number(n || 0);
  if (v >= 1e9) return "Rp" + (v / 1e9).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " M";
  if (v >= 1e6) return "Rp" + (v / 1e6).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " jt";
  return rupiah(v);
};

export const formatTanggal = (s: string): string =>
  s ? new Date(s + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "";

export const formatTanggalPanjang = (s: string): string =>
  s ? new Date(s + "T00:00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "";

export const initials = (nama: string): string =>
  nama
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export const waLink = (wa: string): string => {
  let n = wa.replace(/\D/g, "");
  if (n.startsWith("0")) n = "62" + n.slice(1);
  return "https://wa.me/" + n;
};

export const pct = (a: number, b: number): number => (b ? Math.round((a / b) * 100) : 0);
