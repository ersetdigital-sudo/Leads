"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_STATUS, STATUS_KEY, createSampleLeads } from "./data";
import { todayStr } from "./format";
import type { Lead, Status, StatusTipe, ToastItem, View } from "./types";

const readStoredStatuses = (): Status[] => {
  if (typeof window === "undefined") return DEFAULT_STATUS.map((s) => ({ ...s }));
  try {
    const raw = window.localStorage.getItem(STATUS_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed as Status[];
    }
  } catch {
    /* abaikan localStorage yang rusak */
  }
  return DEFAULT_STATUS.map((s) => ({ ...s }));
};

interface SaveLeadPayload {
  nama: string;
  wa: string;
  sumber: string;
  status: string;
  nilai: string;
  alasan: string;
  followUp: string;
  catatan: string;
}

interface StoreValue {
  leads: Lead[];
  statusList: Status[];
  query: string;
  filterStatus: string;
  filterSumber: string;
  view: View;
  filtered: Lead[];
  editingLead: Lead | null;
  deletingLead: Lead | null;
  formOpen: boolean;
  statusModalOpen: boolean;
  menuOpen: boolean;
  toasts: ToastItem[];
  statusOf: (id: string) => Status;
  tipeOf: (id: string) => StatusTipe;
  chipStyle: (id: string) => React.CSSProperties;
  isOverdue: (l: Lead) => boolean;
  setQuery: (v: string) => void;
  setFilterStatus: (v: string) => void;
  setFilterSumber: (v: string) => void;
  resetFilters: () => void;
  setMenuOpen: (v: boolean) => void;
  openForm: (id?: number) => void;
  closeForm: () => void;
  saveLead: (payload: SaveLeadPayload, editingId: number | null) => void;
  askDelete: (id: number) => void;
  closeConfirm: () => void;
  confirmDelete: () => void;
  changeStatus: (id: number, value: string) => void;
  openStatusModal: () => void;
  closeStatusModal: () => void;
  setStatusList: (list: Status[]) => void;
  toast: (msg: string) => void;
}

const StoreCtx = createContext<StoreValue | null>(null);

export function useStore(): StoreValue {
  const value = useContext(StoreCtx);
  if (!value) throw new Error("useStore harus dipakai di dalam <StoreProvider>");
  return value;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(() => createSampleLeads());
  const [statusList, setStatusListState] = useState<Status[]>(readStoredStatuses);
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSumber, setFilterSumber] = useState("");
  const [view, setView] = useState<View>("pipeline");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  /* ---------- Menu Pipeline / Laporan (tetap pakai hash, seperti versi HTML) ---------- */
  useEffect(() => {
    const sync = () => setView(window.location.hash.slice(1) === "laporan" ? "laporan" : "pipeline");
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  /* ---------- Drawer menu mobile ---------- */
  useEffect(() => {
    document.body.classList.toggle("side-open", menuOpen);
  }, [menuOpen]);

  /* ---------- Kunci scroll saat modal terbuka ---------- */
  const modalOpen = formOpen || deletingId !== null || statusModalOpen;
  useEffect(() => {
    if (!modalOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  /* ---------- Escape menutup semua ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setFormOpen(false);
      setDeletingId(null);
      setStatusModalOpen(false);
      setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ---------- Filter status yang sudah dihapus otomatis dibersihkan ---------- */
  useEffect(() => {
    setFilterStatus((cur) => (cur && !statusList.some((s) => s.id === cur) ? "" : cur));
  }, [statusList]);

  /* ---------- Helper status ---------- */
  const statusOf = useCallback(
    (id: string): Status =>
      statusList.find((s) => s.id === id) || { id, label: id, tipe: "proses", warna: "#8a918c" },
    [statusList],
  );
  const tipeOf = useCallback((id: string): StatusTipe => statusOf(id).tipe, [statusOf]);
  const chipStyle = useCallback(
    (id: string): React.CSSProperties => {
      const w = statusOf(id).warna;
      return { backgroundColor: `${w}1f`, color: w };
    },
    [statusOf],
  );
  const isOverdue = useCallback(
    (l: Lead) => Boolean(l.followUp && l.followUp < todayStr() && tipeOf(l.status) === "proses"),
    [tipeOf],
  );

  /* ---------- Pencarian + filter ---------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const qDigits = q.replace(/\D/g, "");
    return leads
      .filter((l) => {
        if (filterStatus && l.status !== filterStatus) return false;
        if (filterSumber && l.sumber !== filterSumber) return false;
        if (!q) return true;
        return (
          l.nama.toLowerCase().includes(q) ||
          (l.catatan || "").toLowerCase().includes(q) ||
          (qDigits !== "" && l.wa.replace(/\D/g, "").includes(qDigits))
        );
      })
      .sort((a, b) => (b.tanggalMasuk || "").localeCompare(a.tanggalMasuk || "") || b.id - a.id);
  }, [leads, query, filterStatus, filterSumber]);

  const resetFilters = useCallback(() => {
    setQuery("");
    setFilterStatus("");
    setFilterSumber("");
  }, []);

  /* ---------- Toast ---------- */
  const toast = useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, leaving: false }]);
    window.setTimeout(() => setToasts((t) => t.map((x) => (x.id === id ? { ...x, leaving: true } : x))), 2400);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2700);
  }, []);

  /* ---------- Lead ---------- */
  const openForm = useCallback((id?: number) => {
    setEditingId(typeof id === "number" ? id : null);
    setFormOpen(true);
  }, []);
  const closeForm = useCallback(() => setFormOpen(false), []);

  const saveLead = useCallback(
    (payload: SaveLeadPayload, editingId: number | null) => {
      const tipe = tipeOf(payload.status);
      const data = {
        nama: payload.nama.trim(),
        wa: payload.wa.trim(),
        sumber: payload.sumber,
        status: payload.status,
        nilai: tipe === "closing" ? Number(payload.nilai || 0) : 0,
        alasan: tipe === "gagal" ? payload.alasan.trim() : "",
        followUp: payload.followUp,
        catatan: payload.catatan.trim(),
      };
      if (editingId !== null) {
        setLeads((ls) => ls.map((l) => (l.id === editingId ? { ...l, ...data } : l)));
        toast(`Lead "${data.nama}" berhasil diubah`);
      } else {
        setLeads((ls) => {
          const newId = Math.max(0, ...ls.map((l) => l.id)) + 1;
          return [...ls, { id: newId, tanggalMasuk: todayStr(), ...data }];
        });
        toast(`Lead "${data.nama}" berhasil ditambahkan`);
      }
      setFormOpen(false);
    },
    [tipeOf, toast],
  );

  const askDelete = useCallback((id: number) => setDeletingId(id), []);
  const closeConfirm = useCallback(() => setDeletingId(null), []);

  const confirmDelete = useCallback(() => {
    const target = leads.find((x) => x.id === deletingId);
    setLeads((ls) => ls.filter((x) => x.id !== deletingId));
    setDeletingId(null);
    if (target) toast(`Lead "${target.nama}" telah dihapus`);
  }, [leads, deletingId, toast]);

  const changeStatus = useCallback(
    (id: number, value: string) => {
      const lead = leads.find((x) => x.id === id);
      if (!lead) return;
      setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status: value } : l)));
      toast(`Status ${lead.nama} diubah ke ${statusOf(value).label}`);
      // Closing tanpa nilai / Gagal tanpa alasan → buka form untuk melengkapi
      const tipe = tipeOf(value);
      if ((tipe === "closing" && !lead.nilai) || (tipe === "gagal" && !lead.alasan)) {
        setEditingId(id);
        setFormOpen(true);
      }
    },
    [leads, statusOf, tipeOf, toast],
  );

  const setStatusList = useCallback((list: Status[]) => {
    setStatusListState(list);
    try {
      window.localStorage.setItem(STATUS_KEY, JSON.stringify(list));
    } catch {
      /* localStorage penuh / tidak tersedia */
    }
  }, []);

  const value: StoreValue = {
    leads,
    statusList,
    query,
    filterStatus,
    filterSumber,
    view,
    filtered,
    editingLead: leads.find((l) => l.id === editingId) ?? null,
    deletingLead: leads.find((l) => l.id === deletingId) ?? null,
    formOpen,
    statusModalOpen,
    menuOpen,
    toasts,
    statusOf,
    tipeOf,
    chipStyle,
    isOverdue,
    setQuery,
    setFilterStatus,
    setFilterSumber,
    resetFilters,
    setMenuOpen,
    openForm,
    closeForm,
    saveLead,
    askDelete,
    closeConfirm,
    confirmDelete,
    changeStatus,
    openStatusModal: () => setStatusModalOpen(true),
    closeStatusModal: () => setStatusModalOpen(false),
    setStatusList,
    toast,
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
