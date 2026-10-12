import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Pelacak Leads · Pipeline Penjualan";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#133f33",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 18,
              backgroundColor: "rgba(255,255,255,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3v18h18" />
              <path d="m7 15 4-4 3 3 5-6" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 20,
                letterSpacing: 4,
                color: "#a9d5bf",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Pipeline Penjualan
            </div>
            <div style={{ fontSize: 44, fontWeight: 700 }}>Pelacak Leads</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 64, fontWeight: 700, lineHeight: 1.08 }}>
            <span>Pantau setiap lead,</span>
            <span>dari chat sampai closing.</span>
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#c4e0d2" }}>
            <span>Pipeline, follow up harian, dan laporan leads per kanal dalam satu dashboard.</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
