import { Activity, AlertTriangle, ShieldCheck, Wifi } from "lucide-react";

function DashboardKpiCards({ assets, activeThreats }) {
  const criticalAssets = assets.filter((asset) => asset.criticality === "Critical").length;
  const onlineAssets = assets.filter((asset) => asset.operational_status === "Online").length;

  const cards = [
    { label: "Total assets", value: assets.length, icon: Activity, iconClass: "text-cyan-300" },
    { label: "Critical assets", value: criticalAssets, icon: AlertTriangle, iconClass: "text-rose-300" },
    { label: "Online devices", value: onlineAssets, icon: Wifi, iconClass: "text-emerald-300" },
    { label: "Active threats", value: activeThreats, icon: ShieldCheck, iconClass: "text-violet-300" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, iconClass }) => (
        <article key={label} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">{label}</p>
            <span className={`grid h-11 w-11 place-items-center rounded-2xl bg-slate-950/80 ${iconClass}`}>
              <Icon className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-6 text-3xl font-semibold text-white">{value}</p>
        </article>
      ))}
    </div>
  );
}

export default DashboardKpiCards;
