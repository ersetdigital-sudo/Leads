"use client";

import { useEffect, useRef, useState } from "react";
import { Modal } from "./Modal";
import { Icon } from "./Icons";
import { useStore } from "@/lib/store";
import { DEFAULT_STATUS } from "@/lib/data";
import type { Status, StatusTipe } from "@/lib/types";

const TIPE_OPTS: [StatusTipe, string][] = [
  ["proses", "Belum closing"],
  ["closing", "Closing (isi nilai)"],
  ["gagal", "Gagal (isi alasan)"],
];

const PALETTE = ["#2f5aa8", "#6a46b0", "#b7791f", "#2a6a70", "#b0412f", "#1f7a4d"];

export function StatusManagerModal() {
  const { statusModalOpen, closeStatusModal, statusList, setStatusList, leads, toast } = useStore();
  const [draft, setDraft] = useState<Status[]>(statusList);
  const [error, setError] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!statusModalOpen) return;
    setDraft(statusList.map((s) => ({ ...s })));
    setError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusModalOpen]);

  const update = (i: number, key: keyof Status, v: string) =>
    setDraft((p) => p.map((s, idx) => (idx === i ? { ...s, [key]: v } : s)));

  const removeRow = (i: number) => setDraft((p) => p.filter((_, idx) => idx !== i));

  const addRow = () => {
    setDraft((p) => [
      ...p,
      { id: `st${Date.now().toString(36)}`, label: "", tipe: "proses", warna: PALETTE[p.length % PALETTE.length] },
    ]);
    window.setTimeout(() => {
      const inputs = editorRef.current?.querySelectorAll<HTMLInputElement>(".st-name");
      if (inputs && inputs.length) inputs[inputs.length - 1].focus();
    }, 0);
  };

  const save = () => {
    const names = draft.map((s) => s.label.trim());
    if (!draft.length) return setError("Minimal harus ada satu status.");
    if (names.some((n) => !n)) return setError("Nama status tidak boleh kosong.");
    if (new Set(names.map((n) => n.toLowerCase())).size !== names.length)
      return setError("Nama status tidak boleh sama.");
    setStatusList(draft.map((s) => ({ ...s, label: s.label.trim() })));
    closeStatusModal();
    toast("Daftar status disimpan");
  };

  const reset = () => {
    const ids = new Set(DEFAULT_STATUS.map((s) => s.id));
    const lost = leads.filter((l) => !ids.has(l.status)).length;
    if (lost) {
      setError(`Tidak bisa reset: ${lost} lead masih memakai status tambahan.`);
      return;
    }
    setDraft(DEFAULT_STATUS.map((s) => ({ ...s })));
    setError("");
  };

  return (
    <Modal id="status-modal" open={statusModalOpen} labelledBy="status-title" onClose={closeStatusModal}>
      <div className="modal__box">
        <div className="modal__head">
          <h3 className="modal__title" id="status-title">
            Kelola Status
          </h3>
          <button type="button" className="icon-btn" aria-label="Tutup" onClick={closeStatusModal}>
            <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal__body">
          <p className="st-help">
            Tambah, ganti nama, atau ubah warna status. <b>Jenis</b> menentukan hitungan: jenis &quot;Closing&quot; masuk
            ke Sudah Closing dan Nilai Closing, jenis &quot;Belum closing&quot; masuk ke Belum Closing. Status yang masih
            dipakai lead tidak bisa dihapus.
          </p>

          <div className="st-editor" ref={editorRef}>
            {draft.map((st, i) => {
              const used = leads.filter((l) => l.status === st.id).length;
              return (
                <div className="st-row" key={st.id}>
                  <input
                    type="color"
                    className="st-color"
                    value={st.warna}
                    aria-label={`Warna status ${st.label || i + 1}`}
                    onChange={(e) => update(i, "warna", e.target.value)}
                  />
                  <input
                    className="input st-name"
                    value={st.label}
                    placeholder="Nama status"
                    aria-label="Nama status"
                    onChange={(e) => update(i, "label", e.target.value)}
                  />
                  <select
                    className="select st-type"
                    value={st.tipe}
                    aria-label="Jenis status"
                    onChange={(e) => update(i, "tipe", e.target.value)}
                  >
                    {TIPE_OPTS.map(([v, t]) => (
                      <option key={v} value={v}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="icon-btn icon-btn--danger"
                    title={used ? `${used} lead memakai status ini` : "Hapus status"}
                    aria-label="Hapus status"
                    disabled={used > 0}
                    onClick={() => removeRow(i)}
                  >
                    <Icon name="trash" />
                  </button>
                </div>
              );
            })}
          </div>

          <button type="button" className="btn btn--ghost st-add" onClick={addRow}>
            <Icon name="plus" />
            Tambah Status
          </button>
          <div className="rekap-error">{error}</div>
        </div>

        <div className="modal__foot">
          <button type="button" className="btn btn--ghost st-reset" onClick={reset}>
            Kembalikan bawaan
          </button>
          <button type="button" className="btn btn--ghost" onClick={closeStatusModal}>
            Batal
          </button>
          <button type="button" className="btn btn--primary" onClick={save}>
            Simpan
          </button>
        </div>
      </div>
    </Modal>
  );
}
