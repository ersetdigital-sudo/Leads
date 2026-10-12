"use client";

import { motion } from "framer-motion";
import { Icon } from "./Icons";
import { useStore } from "@/lib/store";
import { SUMBER_LIST } from "@/lib/data";
import { pct } from "@/lib/format";

const reveal = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.4, delay, ease: "easeOut" as const },
});

export function SidebarPanels() {
  const { leads, statusList, tipeOf, openStatusModal } = useStore();
  const total = leads.length;

  const sources = SUMBER_LIST.map((src) => {
    const all = leads.filter((l) => l.sumber === src);
    const closing = all.filter((l) => tipeOf(l.status) === "closing").length;
    return { src, total: all.length, closing };
  }).sort((a, b) => b.closing - a.closing || b.total - a.total);

  return (
    <aside className="sidebar">
      <motion.section className="card panel" {...reveal()}>
        <div className="panel__head">
          <h2 className="panel__title">Status Pipeline</h2>
          <button type="button" className="link-btn" onClick={openStatusModal}>
            <Icon name="sliders" />
            Kelola Status
          </button>
        </div>
        <div className="label" style={{ margin: "-8px 0 16px" }}>
          {total} lead
        </div>
        <div>
          {statusList.map((s) => {
            const n = leads.filter((l) => l.status === s.id).length;
            const p = pct(n, total);
            return (
              <div className="pipe-item" key={s.id}>
                <div className="pipe-item__row">
                  <span className="pipe-item__label">
                    <span className="dot" style={{ background: s.warna }} />
                    {s.label}
                  </span>
                  <span className="pipe-item__num">
                    <b>{n}</b>
                    {p}%
                  </span>
                </div>
                <div className="bar">
                  <div className="bar__fill" style={{ width: `${p}%`, background: s.warna }} />
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      <motion.section className="card panel" {...reveal(0.08)}>
        <div className="panel__head">
          <h2 className="panel__title">Sumber Leads</h2>
          <span className="label">Lead · Closing</span>
        </div>
        <div>
          {sources.map((r) => (
            <div className="src-item" key={r.src}>
              <div>
                <div className="src-item__name">{r.src}</div>
                <div className="src-item__sub">{pct(r.closing, r.total)}% konversi</div>
              </div>
              <div className="src-item__stats">
                <div className="src-item__count">{r.total} lead</div>
                <div className={`src-item__closing${r.closing ? "" : " is-zero"}`}>{r.closing} closing</div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </aside>
  );
}
