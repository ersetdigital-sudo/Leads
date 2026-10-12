"use client";

import { motion } from "framer-motion";
import { Icon } from "./Icons";
import { useStore } from "@/lib/store";
import { pct, rupiah, rupiahSingkat } from "@/lib/format";

const CARDS = [
  { key: "total", label: "Total Leads", icon: "users" as const, hint: "Semua lead yang masuk" },
  { key: "closing", label: "Sudah Closing", icon: "checkCircle" as const, hint: "Persentase dari total lead", mod: " stat--success" },
  { key: "belum", label: "Belum Closing", icon: "clock" as const, hint: "Masih diproses atau follow up" },
  { key: "nilai", label: "Nilai Closing", icon: "money" as const, hint: "Total transaksi closing" },
];

export function StatsCards() {
  const { leads, tipeOf } = useStore();

  const total = leads.length;
  const closing = leads.filter((l) => tipeOf(l.status) === "closing");
  const belum = leads.filter((l) => tipeOf(l.status) === "proses").length;
  const nilai = closing.reduce((s, l) => s + Number(l.nilai || 0), 0);

  const value = (key: string) => {
    if (key === "total") return String(total);
    if (key === "closing")
      return (
        <>
          {closing.length}
          <small>{pct(closing.length, total)}%</small>
        </>
      );
    if (key === "belum") return String(belum);
    return rupiahSingkat(nilai);
  };

  return (
    <section className="stats" aria-label="Statistik">
      {CARDS.map((c, i) => (
        <motion.article
          key={c.key}
          className={`card stat${c.mod ?? ""}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
        >
          <div className="stat__top">
            <span className="label">{c.label}</span>
            <span className="stat__icon">
              <Icon name={c.icon} />
            </span>
          </div>
          <div className="stat__value">{value(c.key)}</div>
          <div className="stat__hint">
            {c.key === "nilai" ? `${rupiah(nilai)} dari ${closing.length} transaksi` : c.hint}
          </div>
        </motion.article>
      ))}
    </section>
  );
}
