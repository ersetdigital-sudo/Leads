"use client";

import { motion } from "framer-motion";
import { Icon } from "./Icons";
import { useStore } from "@/lib/store";
import { SUMBER_LIST, SUMBER_WARNA } from "@/lib/data";
import { formatTanggal, pct, rupiah, rupiahSingkat, todayStr } from "@/lib/format";

interface RekapRow {
  tanggal: string;
  total: number;
  closing: number;
  nilai: number;
  src: Record<string, number>;
}

const warna = (src: string) => SUMBER_WARNA[src] || "#9aa19c";

export function ReportView() {
  const { leads, tipeOf, view } = useStore();

  const rows = leads
    .reduce<RekapRow[]>((acc, l) => {
      const d = l.tanggalMasuk || todayStr();
      let r = acc.find((x) => x.tanggal === d);
      if (!r) {
        r = { tanggal: d, total: 0, closing: 0, nilai: 0, src: {} };
        acc.push(r);
      }
      r.total++;
      r.src[l.sumber] = (r.src[l.sumber] || 0) + 1;
      if (tipeOf(l.status) === "closing") {
        r.closing++;
        r.nilai += Number(l.nilai || 0);
      }
      return acc;
    }, [])
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal));

  const total = leads.length;
  const closing = leads.filter((l) => tipeOf(l.status) === "closing");
  const nilai = closing.reduce((s, l) => s + Number(l.nilai || 0), 0);
  const srcTotal = (src: string) => leads.filter((l) => l.sumber === src).length;

  return (
    <motion.section
      className={`card rekap${view !== "laporan" ? " is-hidden" : ""}`}
      id="view-laporan"
      data-show="laporan"
      aria-label="Laporan leads"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="rekap__head">
        <div>
          <h2 className="rekap__title">Rekap Leads Harian</h2>
          <p className="rekap__sub">
            Dihitung otomatis dari data leads di Pipeline, berdasarkan tanggal masuk dan sumber.
          </p>
        </div>
      </div>

      {/* Ringkasan */}
      <div className="rekap-summary">
        <div className="rk-sum rk-sum--main">
          <span className="label">Total Leads</span>
          <b>{total}</b>
          <small>{rows.length} hari ada leads masuk</small>
        </div>
        <div className="rk-sum rk-sum--ok">
          <span className="label">Total Closing</span>
          <b>{closing.length}</b>
          <small>{pct(closing.length, total)}% konversi</small>
        </div>
        <div className="rk-sum rk-sum--ok">
          <span className="label">Nilai Closing</span>
          <b>{rupiahSingkat(nilai)}</b>
          <small>{rupiah(nilai)}</small>
        </div>
        {SUMBER_LIST.map((src) => {
          const v = srcTotal(src);
          return (
            <div className="rk-sum" key={src}>
              <span className="label">
                <i style={{ background: warna(src) }} />
                {src}
              </span>
              <b>{v}</b>
              <small>{pct(v, total)}% dari total</small>
            </div>
          );
        })}
      </div>

      {/* Kartu versi mobile */}
      <div className="rekap-cards">
        {rows.map((r) => {
          const d = new Date(r.tanggal + "T00:00:00");
          const srcs = SUMBER_LIST.filter((s) => r.src[s]);
          return (
            <article className="rk-card" key={r.tanggal}>
              <header className="rk-card__top">
                <div className="rk-datebox">
                  <b>{d.getDate()}</b>
                  <span>{d.toLocaleDateString("id-ID", { month: "short" })}</span>
                </div>
                <div className="rk-card__head">
                  <div className="rk-card__day">{d.toLocaleDateString("id-ID", { weekday: "long" })}</div>
                  <div className="rk-card__total">
                    <b>{r.total}</b> leads masuk
                  </div>
                </div>
              </header>

              <div className="rk-bar">
                {srcs.map((s) => (
                  <span key={s} style={{ flex: r.src[s], background: warna(s) }} />
                ))}
              </div>

              <div className="rk-srcs">
                {srcs.map((s) => (
                  <span className="rk-src" key={s}>
                    <i style={{ background: warna(s) }} />
                    {s}
                    <b>{r.src[s]}</b>
                  </span>
                ))}
              </div>

              <footer className={`rk-card__foot${r.closing ? " is-ok" : ""}`}>
                <span className="rk-close-ic">
                  <Icon name="check" />
                </span>
                <span>
                  <b>{r.closing}</b> closing{r.nilai ? ` · ${rupiah(r.nilai)}` : ""}
                </span>
                <span className="rk-conv">{pct(r.closing, r.total)}%</span>
              </footer>
            </article>
          );
        })}
        {rows.length === 0 ? (
          <p className="st-help" style={{ textAlign: "center", padding: "24px 0" }}>
            Belum ada data leads.
          </p>
        ) : null}
      </div>

      {/* Tabel versi desktop */}
      <div className="table-wrap">
        <table className="rekap-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              {SUMBER_LIST.map((s) => (
                <th className="num" key={s}>
                  {s}
                </th>
              ))}
              <th className="num">Total Leads</th>
              <th className="num">Closing</th>
              <th className="num">Nilai Closing</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.tanggal}>
                <td className="rk-date">{formatTanggal(r.tanggal)}</td>
                {SUMBER_LIST.map((s) => (
                  <td className={`num${r.src[s] ? "" : " is-zero"}`} key={s}>
                    {r.src[s] || 0}
                  </td>
                ))}
                <td className="num">
                  <b>{r.total}</b>
                </td>
                <td className="num">
                  <span className={`rk-pill${r.closing ? " is-on" : ""}`}>{r.closing}</span>
                </td>
                <td className="num">{r.nilai ? rupiah(r.nilai) : "–"}</td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={SUMBER_LIST.length + 4} style={{ textAlign: "center", color: "var(--muted)", padding: 32 }}>
                  Belum ada data leads.
                </td>
              </tr>
            ) : null}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              {SUMBER_LIST.map((s) => (
                <td className="num" key={s}>
                  {srcTotal(s)}
                </td>
              ))}
              <td className="num">
                <b>{total}</b>
              </td>
              <td className="num">{closing.length}</td>
              <td className="num">{rupiah(nilai)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </motion.section>
  );
}
