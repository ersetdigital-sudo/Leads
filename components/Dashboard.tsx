"use client";

import dynamic from "next/dynamic";
import { StoreProvider } from "@/lib/store";

/* Aplikasi ini sepenuhnya interaktif dan membangun data contoh berdasarkan
   tanggal hari ini, jadi di-render di client saja supaya bebas hydration error. */
const App = dynamic(() => import("./App").then((m) => m.App), {
  ssr: false,
  loading: () => <DashboardSkeleton />,
});

function DashboardSkeleton() {
  return (
    <div className="app-main" aria-busy="true">
      <div className="hero">
        <header className="app-header">
          <div className="container app-header__inner">
            <div className="brand">
              <div className="brand__mark" />
              <div>
                <div className="brand__eyebrow">Pipeline Penjualan</div>
                <div className="brand__title">Pelacak Leads</div>
              </div>
            </div>
          </div>
        </header>
        <div className="hero-intro">
          <h2>
            Pantau setiap lead, <br />
            dari chat sampai closing.
          </h2>
          <p>Lihat siapa yang perlu di-follow up hari ini dan sumber mana yang paling menghasilkan.</p>
        </div>
      </div>
      <main className="container">
        <section className="stats" aria-label="Statistik">
          {[0, 1, 2, 3].map((i) => (
            <div className="card stat" key={i}>
              <div className="stat__top">
                <span className="label">&nbsp;</span>
              </div>
              <div className="stat__value">&nbsp;</div>
              <div className="stat__hint">&nbsp;</div>
            </div>
          ))}
        </section>
        <div className="layout">
          <section className="card leads-panel" style={{ minHeight: 420 }} />
          <aside className="sidebar">
            <section className="card panel" style={{ minHeight: 220 }} />
            <section className="card panel" style={{ minHeight: 220 }} />
          </aside>
        </div>
      </main>
    </div>
  );
}

export function Dashboard() {
  return (
    <StoreProvider>
      <App />
    </StoreProvider>
  );
}
