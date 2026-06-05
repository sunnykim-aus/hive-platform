// Standalone "this is a Pro feature" panel for locked in-page sections.
export default function ProUpgradePanel({
  title,
  body,
}: {
  title: string
  body: string
}) {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, #0c1829, #0b1322)",
        border: "1px solid #1e2d40",
        borderRadius: 14,
        padding: "40px 28px",
        textAlign: "center",
        maxWidth: 560,
        margin: "8px auto",
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: 12 }}>🔒</div>
      <p
        style={{
          color: "#f6c90e",
          fontWeight: 800,
          fontSize: "0.72rem",
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        CHP Pro feature
      </p>
      <h3 style={{ color: "#fff", fontSize: "1.15rem", fontWeight: 800, margin: "0 0 10px" }}>
        {title}
      </h3>
      <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6, margin: "0 0 22px" }}>
        {body}
      </p>
      <a
        href="https://impactanalyticsaustralia.com.au/#contact"
        style={{
          display: "inline-block",
          background: "#f6c90e",
          color: "#0b1220",
          fontWeight: 800,
          borderRadius: 8,
          padding: "11px 22px",
          fontSize: "0.88rem",
          textDecoration: "none",
        }}
      >
        Upgrade to Pro
      </a>
    </div>
  )
}
