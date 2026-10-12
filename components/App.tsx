"use client";

import { useEffect } from "react";
import { Header } from "./Header";
import { MobileSidebar } from "./MobileSidebar";
import { StatsCards } from "./StatsCards";
import { LeadList } from "./LeadList";
import { SidebarPanels } from "./SidebarPanels";
import { ReportView } from "./ReportView";
import { LeadFormModal } from "./LeadFormModal";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { StatusManagerModal } from "./StatusManagerModal";
import { Toast } from "./Toast";
import { Icon } from "./Icons";
import { useStore } from "@/lib/store";

const hidden = (visible: boolean) => (visible ? "" : " is-hidden");

export function App() {
  const { view, openForm } = useStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  return (
    <>
      <MobileSidebar />

      <div className="app-main">
        <div className="hero">
          <Header />

          <div className="hero-intro">
            <div data-show="pipeline" className={hidden(view === "pipeline")}>
              <h2>
                Pantau setiap lead, <br />
                dari chat sampai closing.
              </h2>
              <p>Lihat siapa yang perlu di-follow up hari ini dan sumber mana yang paling menghasilkan.</p>
            </div>
            <div data-show="laporan" className={hidden(view === "laporan")}>
              <h2>Laporan Leads</h2>
              <p>Rekap jumlah leads per kanal dan closing setiap hari.</p>
            </div>
          </div>
        </div>

        <main className="container">
          <div id="view-pipeline" data-show="pipeline" className={hidden(view === "pipeline")}>
            <StatsCards />
            <div className="layout">
              <LeadList />
              <SidebarPanels />
            </div>
          </div>

          <ReportView />
        </main>
      </div>

      {/* Tombol tambah besar di mobile */}
      <button
        type="button"
        className={`btn btn--primary fab${hidden(view === "pipeline")}`}
        data-show="pipeline"
        onClick={() => openForm()}
      >
        <Icon name="plus" />
        Tambah Lead
      </button>

      <LeadFormModal />
      <ConfirmDeleteModal />
      <StatusManagerModal />
      <Toast />
    </>
  );
}
