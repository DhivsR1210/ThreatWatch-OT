const cards = [
  { key: "total", label: "Managed assets", tone: "text-slate-100", detail: "Across monitored locations" },
  { key: "critical", label: "Critical assets", tone: "text-rose-300", detail: "Require elevated attention" },
  { key: "online", label: "Online now", tone: "text-emerald-300", detail: "Reporting operational status" },
  { key: "risk", label: "Average risk", tone: "text-amber-300", detail: "Based on asset risk scores" },
];

function AssetSummaryCards({ assets }) {
  const values = {
    total: assets.length,
    critical: assets.filter((asset) => asset.criticality === "Critical").length,
    online: assets.filter((asset) => asset.operational_status === "Online").length,
    risk: assets.length
      ? Math.round(assets.reduce((sum, asset) => sum + asset.risk_score, 0) / assets.length)
      : 0,
  };

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article className="glass-panel rounded-3xl border p-5 transition hover:-translate-y-1 hover:border-cyan-400/20" key={card.key}>
          <p className="text-sm font-medium text-slate-400">{card.label}</p>
          <p className={`mt-3 text-3xl font-semibold tracking-tight ${card.tone}`}>{values[card.key]}</p>
          <p className="mt-2 text-xs text-slate-500">{card.detail}</p>
        </article>
      ))}
    </section>
  );
}

export default AssetSummaryCards;
