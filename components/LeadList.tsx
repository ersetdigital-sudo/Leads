"use client";

import { motion } from "framer-motion";
import { Icon } from "./Icons";
import { useStore } from "@/lib/store";
import { formatTanggal, initials, rupiah, waLink } from "@/lib/format";
import { SUMBER_LIST } from "@/lib/data";
import type { Lead } from "@/lib/types";

function LeadRow({ lead, index }: { lead: Lead; index: number }) {
  const { statusList, tipeOf, chipStyle, isOverdue, openForm, askDelete, changeStatus } = useStore();

  const overdue = isOverdue(lead);
  const tipe = tipeOf(lead.status);

  let extra = null;
  if (tipe === "closing") extra = <span className="deal">{rupiah(lead.nilai)}</span>;
  if (tipe === "gagal" && lead.alasan) extra = <span className="reason">{lead.alasan}</span>;

  const followUpLine =
    lead.followUp && tipe === "proses" ? (
      overdue ? (
        <span className="date-line overdue">
          <Icon name="clock" /> Follow up lewat · {formatTanggal(lead.followUp)}
        </span>
      ) : (
        <span className="date-line">
          <Icon name="clock" /> Follow up {formatTanggal(lead.followUp)}
        </span>
      )
    ) : null;

  return (
    <motion.li
      className={`lead${overdue ? " is-overdue" : ""}`}
      data-id={lead.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3), ease: "easeOut" }}
    >
      <div className="avatar">{initials(lead.nama)}</div>

      <div className="lead__main">
        <div className="lead__name">{lead.nama}</div>
        <div className="lead__meta">
          <a className="wa-link" href={waLink(lead.wa)} target="_blank" rel="noopener noreferrer" title="Buka chat WhatsApp">
            <Icon name="phone" />
            {lead.wa}
          </a>
        </div>
        {lead.catatan ? <div className="lead__note">{lead.catatan}</div> : null}
      </div>

      <div className="lead__info">
        <span className="tag">{lead.sumber}</span>
        <span className="date-line">
          <Icon name="calendar" /> Masuk {formatTanggal(lead.tanggalMasuk)}
        </span>
        {followUpLine}
      </div>

      <div className="lead__status">
        <select
          className="status-select"
          style={chipStyle(lead.status)}
          value={lead.status}
          aria-label={`Ganti status ${lead.nama}`}
          onChange={(e) => changeStatus(lead.id, e.target.value)}
        >
          {statusList.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        {extra}
      </div>

      <div className="lead__actions">
        <button type="button" className="icon-btn" title="Ubah lead" aria-label={`Ubah lead ${lead.nama}`} onClick={() => openForm(lead.id)}>
          <Icon name="edit" />
        </button>
        <button
          type="button"
          className="icon-btn icon-btn--danger"
          title="Hapus lead"
          aria-label={`Hapus lead ${lead.nama}`}
          onClick={() => askDelete(lead.id)}
        >
          <Icon name="trash" />
        </button>
      </div>
    </motion.li>
  );
}

export function LeadList() {
  const { statusList, filtered, query, setQuery, filterStatus, setFilterStatus, filterSumber, setFilterSumber, resetFilters } =
    useStore();

  return (
    <section className="card leads-panel" aria-label="Daftar leads">
      <div className="toolbar">
        <div className="search">
          <Icon name="search" />
          <input
            className="input"
            type="search"
            placeholder="Cari nama, nomor WA, atau catatan…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="select"
          aria-label="Filter status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Semua status</option>
          {statusList.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          className="select"
          aria-label="Filter sumber"
          value={filterSumber}
          onChange={(e) => setFilterSumber(e.target.value)}
        >
          <option value="">Semua sumber</option>
          {SUMBER_LIST.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="result-bar">
        <b>{filtered.length}</b> lead ditemukan
      </div>

      <ul className="lead-list">
        {filtered.map((l, i) => (
          <LeadRow key={l.id} lead={l} index={i} />
        ))}
      </ul>

      <div className={`empty${filtered.length ? " is-hidden" : ""}`}>
        <div className="empty__icon">
          <Icon name="searchEmpty" />
        </div>
        <div className="empty__title">Tidak ada lead yang cocok</div>
        <p className="empty__text">Coba ubah kata kunci pencarian atau filter yang dipilih.</p>
        <button type="button" className="btn btn--ghost" onClick={resetFilters}>
          Hapus pencarian &amp; filter
        </button>
      </div>
    </section>
  );
}
