import Navbar from "@/components/layout/Navbar";

export default function ResultsLoadingSkeleton() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />
      <main style={{ paddingTop: 80 }}>
        {/* Header skeleton */}
        <div
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(13,20,36,0.6)",
            padding: "28px 40px",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div className="skeleton" style={{ width: 160, height: 12, marginBottom: 12, borderRadius: 6 }} />
            <div className="skeleton" style={{ width: 320, height: 26, marginBottom: 10, borderRadius: 8 }} />
            <div className="skeleton" style={{ width: 200, height: 12, borderRadius: 6 }} />
          </div>
        </div>

        {/* Content skeleton */}
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "40px 40px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
        >
          <div
            className="skeleton"
            style={{ gridColumn: "1/-1", height: 180, borderRadius: 16 }}
          />
          <div className="skeleton" style={{ height: 320, borderRadius: 16 }} />
          <div className="skeleton" style={{ height: 320, borderRadius: 16 }} />
          <div
            className="skeleton"
            style={{ gridColumn: "1/-1", height: 400, borderRadius: 16 }}
          />
        </div>
      </main>
    </div>
  );
}
