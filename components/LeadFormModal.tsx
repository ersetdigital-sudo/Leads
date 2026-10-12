"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Modal } from "./Modal";
import { useStore } from "@/lib/store";
import { SUMBER_LIST } from "@/lib/data";
import type { LeadDraft } from "@/lib/types";

const EMPTY: LeadDraft = {
  nama: "",
  wa: "",
  sumber: "",
  status: "",
  nilai: "",
  alasan: "",
  followUp: "",
  catatan: "",
};

export function LeadFormModal() {
  const { formOpen, closeForm, editingLead, statusList, tipeOf, saveLead } = useStore();
  const [values, setValues] = useState<LeadDraft>(EMPTY);
  const [errors, setErrors] = useState<{ nama?: string; wa?: string }>({});
  const namaRef = useRef<HTMLInputElement>(null);

  /* Isi ulang form tiap kali dibuka (persis perilaku versi HTML) */
  useEffect(() => {
    if (!formOpen) return;
    const l = editingLead;
    const defaultStatus = statusList.find((s) => s.tipe === "proses") ?? statusList[0];
    setValues({
      nama: l?.nama ?? "",
      wa: l?.wa ?? "",
      sumber: l?.sumber ?? SUMBER_LIST[0],
      status: l?.status ?? defaultStatus?.id ?? "",
      nilai: l?.nilai ? String(l.nilai) : "",
      alasan: l?.alasan ?? "",
      followUp: l?.followUp ?? "",
      catatan: l?.catatan ?? "",
    });
    setErrors({});
    const t = window.setTimeout(() => namaRef.current?.focus(), 80);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formOpen]);

  const set = (k: keyof LeadDraft, v: string) => setValues((p) => ({ ...p, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: { nama?: string; wa?: string } = {};
    const nama = values.nama.trim();
    const wa = values.wa.trim();
    if (!nama) next.nama = "Nama wajib diisi.";
    if (!wa) next.wa = "Nomor WA wajib diisi.";
    else if (!/^\+?[\d\s-]{9,16}$/.test(wa)) next.wa = "Nomor WA tidak valid. Contoh: 081234567890";
    setErrors(next);
    if (next.nama) {
      namaRef.current?.focus();
      return;
    }
    if (next.wa) {
      document.getElementById("f-wa")?.focus();
      return;
    }
    saveLead(values, editingLead?.id ?? null);
  };

  const tipe = tipeOf(values.status);

  return (
    <Modal id="form-modal" open={formOpen} labelledBy="form-title" onClose={closeForm}>
      <form className="modal__box" onSubmit={submit} noValidate>
        <div className="modal__head">
          <h3 className="modal__title" id="form-title">
            {editingLead ? "Ubah Lead" : "Tambah Lead"}
          </h3>
          <button type="button" className="icon-btn" aria-label="Tutup" onClick={closeForm}>
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal__body form-grid">
          <div className={`field field--full${errors.nama ? " has-error" : ""}`}>
            <label className="label" htmlFor="f-nama">
              Nama <span className="req">*</span>
            </label>
            <input
              id="f-nama"
              name="nama"
              className="input"
              placeholder="Contoh: Rina Kartika"
              value={values.nama}
              onChange={(e) => {
                set("nama", e.target.value);
                if (errors.nama) setErrors((p) => ({ ...p, nama: undefined }));
              }}
            />
            <div className="error-msg">{errors.nama}</div>
          </div>

          <div className={`field${errors.wa ? " has-error" : ""}`}>
            <label className="label" htmlFor="f-wa">
              Nomor WA <span className="req">*</span>
            </label>
            <input
              id="f-wa"
              name="wa"
              className="input"
              inputMode="tel"
              placeholder="081234567890"
              value={values.wa}
              onChange={(e) => {
                set("wa", e.target.value);
                if (errors.wa) setErrors((p) => ({ ...p, wa: undefined }));
              }}
            />
            <div className="error-msg">{errors.wa}</div>
          </div>

          <div className="field">
            <label className="label" htmlFor="f-sumber">
              Sumber
            </label>
            <select id="f-sumber" name="sumber" className="select" value={values.sumber} onChange={(e) => set("sumber", e.target.value)}>
              {SUMBER_LIST.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label" htmlFor="f-status">
              Status
            </label>
            <select id="f-status" name="status" className="select" value={values.status} onChange={(e) => set("status", e.target.value)}>
              {statusList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label" htmlFor="f-followup">
              Tanggal Follow Up
            </label>
            <input
              id="f-followup"
              name="followUp"
              type="date"
              className="input"
              value={values.followUp}
              onChange={(e) => set("followUp", e.target.value)}
            />
          </div>

          <div className={`field field--full${tipe === "closing" ? "" : " is-hidden"}`}>
            <label className="label" htmlFor="f-nilai">
              Nilai Closing (Rp)
            </label>
            <input
              id="f-nilai"
              name="nilai"
              type="number"
              min={0}
              step={1000}
              className="input"
              placeholder="Contoh: 2500000"
              value={values.nilai}
              onChange={(e) => set("nilai", e.target.value)}
            />
          </div>

          <div className={`field field--full${tipe === "gagal" ? "" : " is-hidden"}`}>
            <label className="label" htmlFor="f-alasan">
              Alasan Gagal
            </label>
            <input
              id="f-alasan"
              name="alasan"
              className="input"
              placeholder="Contoh: Harga di atas budget"
              value={values.alasan}
              onChange={(e) => set("alasan", e.target.value)}
            />
          </div>

          <div className="field field--full">
            <label className="label" htmlFor="f-catatan">
              Catatan
            </label>
            <textarea
              id="f-catatan"
              name="catatan"
              className="textarea"
              placeholder="Kebutuhan, permintaan, atau hasil obrolan terakhir…"
              value={values.catatan}
              onChange={(e) => set("catatan", e.target.value)}
            />
          </div>
        </div>

        <div className="modal__foot">
          <button type="button" className="btn btn--ghost" onClick={closeForm}>
            Batal
          </button>
          <button type="submit" className="btn btn--primary">
            {editingLead ? "Simpan Perubahan" : "Simpan Lead"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
