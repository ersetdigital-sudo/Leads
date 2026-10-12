"use client";

import { Icon } from "./Icons";
import { useStore } from "@/lib/store";

/* Drawer navigasi — hanya tampil di layar ≤768px (aturan CSS asli) */
export function MobileSidebar() {
  const { view, menuOpen, setMenuOpen, openForm } = useStore();
  const close = () => setMenuOpen(false);

  return (
    <>
      <aside className="app-sidebar" id="app-sidebar" aria-label="Navigasi" aria-hidden={!menuOpen}>
        <div className="side-brand">
          <div className="side-brand__mark">
            <Icon name="brand" />
          </div>
          <div>
            <div className="side-brand__title">Pelacak Leads</div>
            <div className="side-brand__sub">Pipeline Penjualan</div>
          </div>
        </div>
        <div className="side-label">Menu</div>
        <nav className="side-nav">
          <a href="#pipeline" className={`side-link${view === "pipeline" ? " is-active" : ""}`} onClick={close}>
            <Icon name="usersSingle" />
            Pipeline
          </a>
          <a href="#laporan" className={`side-link${view === "laporan" ? " is-active" : ""}`} onClick={close}>
            <Icon name="chart" />
            Laporan Leads
          </a>
        </nav>
        <button
          type="button"
          className="btn btn--primary side-add"
          onClick={() => {
            close();
            openForm();
          }}
        >
          <Icon name="plus" />
          Tambah Lead
        </button>
      </aside>
      <div className="side-overlay" id="side-overlay" onClick={close} aria-hidden="true" />
    </>
  );
}
