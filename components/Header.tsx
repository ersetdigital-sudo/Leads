"use client";

import { Icon } from "./Icons";
import { useStore } from "@/lib/store";

const NAV = [
  { href: "#pipeline", view: "pipeline", label: "Pipeline", icon: "usersSingle" as const },
  { href: "#laporan", view: "laporan", label: "Laporan Leads", icon: "chart" as const },
];

export function Header() {
  const { view, openForm, setMenuOpen } = useStore();
  const addHidden = view !== "pipeline";

  return (
    <header className="app-header">
      <div className="container app-header__inner">
        <button type="button" className="menu-toggle" aria-label="Buka menu" onClick={() => setMenuOpen(true)}>
          <Icon name="menu" />
        </button>

        <div className="brand">
          <div className="brand__mark">
            <Icon name="brand" />
          </div>
          <div>
            <div className="brand__eyebrow">Pipeline Penjualan</div>
            <h1 className="brand__title">Pelacak Leads</h1>
          </div>
        </div>

        <nav className="app-nav" aria-label="Menu utama">
          {NAV.map((n) => (
            <a
              key={n.view}
              href={n.href}
              className={`app-nav__link${view === n.view ? " is-active" : ""}`}
              aria-current={view === n.view ? "page" : undefined}
            >
              <Icon name={n.icon} />
              {n.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className={`btn btn--primary btn--lg header-add${addHidden ? " is-hidden" : ""}`}
          onClick={() => openForm()}
        >
          <Icon name="plus" />
          Tambah Lead
        </button>
      </div>
    </header>
  );
}
