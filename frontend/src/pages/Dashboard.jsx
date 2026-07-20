import { useMemo } from "react";
import { Activity, AlertTriangle, BarChart3, CircleDot, ShieldAlert, Signal } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";

import DashboardKpiCards from "../components/DashboardKpiCards";
import { useAssets } from "../hooks/useAssets";
import { recentSecurityEvents, statusBadgeStyles } from "../data/seedData";

const chartColors = {
  critical: "#f43f5e",
  high: "#fb923c",
  medium: "#f59e0b",
  low: "#22d3ee",
  online: "#34d399",
  offline: "#64748b",
  maintenance: "#fbbf24",
};

const typeColors = ["#22d3ee", "#38bdf8", "#818cf8", "#a855f7", "#f97316", "#fb7185"];

function Dashboard() {
  const { assets } = useAssets();

  const assetTypeData = useMemo(() => {
    const counts = assets.reduce((acc, asset) => {
      acc[asset.asset_type] = (acc[asset.asset_type] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [assets]);

  const vendorData = useMemo(() => {
    const counts = assets.reduce((acc, asset) => {
      const vendor = asset.vendor || "Unknown";
      acc[vendor] = (acc[vendor] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));
  }, [assets]);

  const operationalData = useMemo(() => {
    const counts = assets.reduce((acc, asset) => {
      acc[asset.operational_status] = (acc[asset.operational_status] || 0) + 1;
      return acc;
    }, {});
    return ["Online", "Offline", "Maintenance"].map((label) => ({ name: label, value: counts[label] || 0 }));
  }, [assets]);

  const criticalityData = useMemo(() => {
    const counts = assets.reduce((acc, asset) => {
      const criticality = asset.criticality || "Low";
      acc[criticality] = (acc[criticality] || 0) + 1;
      return acc;
    }, {});
    return ["Critical", "High", "Medium", "Low"].map((label) => ({
      name: label,
      value: counts[label] || 0,
    }));
  }, [assets]);

  const riskHeatmapData = useMemo(() => {
    const riskCategories = ["Low", "Medium", "High", "Critical"];
    const vendors = Array.from(new Set(assets.map((asset) => asset.vendor || "Unknown"))).sort();
    return vendors.flatMap((vendor, vendorIndex) => {
      const vendorAssets = assets.filter((asset) => (asset.vendor || "Unknown") === vendor);
      return riskCategories.map((category, categoryIndex) => {
        const count = vendorAssets.filter((asset) => {
          if (category === "Critical") return asset.risk_score >= 80;
          if (category === "High") return asset.risk_score >= 60 && asset.risk_score < 80;
          if (category === "Medium") return asset.risk_score >= 40 && asset.risk_score < 60;
          return asset.risk_score < 40;
        }).length;
        return {
          vendor,
          category,
          x: vendorIndex,
          y: categoryIndex,
          count,
          size: Math.max(12, count * 14),
          color: count === 0 ? "#0f172a" : count < 2 ? "#22d3ee" : count < 4 ? "#38bdf8" : "#f43f5e",
        };
      });
    });
  }, [assets]);

  const activeThreats = recentSecurityEvents.length;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-8 shadow-xl shadow-cyan-500/5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Security operations</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">OT Security command center</h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">A unified view of industrial asset health, risk posture, and active security events across critical automation infrastructure.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
              <p className="text-sm text-slate-400">Threat detection latency</p>
              <p className="mt-2 text-3xl font-semibold text-white">4m 12s</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
              <p className="text-sm text-slate-400">Average response score</p>
              <p className="mt-2 text-3xl font-semibold text-white">86%</p>
            </div>
          </div>
        </div>
      </section>

      <DashboardKpiCards assets={assets} activeThreats={activeThreats} />

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3 text-slate-100">
            <ShieldAlert className="h-5 w-5 text-cyan-300" />
            <div>
              <h2 className="text-lg font-semibold">Asset type distribution</h2>
              <p className="text-sm text-slate-400">Breakdown of OT systems by device class.</p>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={assetTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={98} paddingAngle={4} stroke="transparent">
                  {assetTypeData.map((entry, index) => (
                    <Cell key={entry.name} fill={typeColors[index % typeColors.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ color: "#cbd5e1", paddingTop: 16 }} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3 text-slate-100">
            <Activity className="h-5 w-5 text-cyan-300" />
            <div>
              <h2 className="text-lg font-semibold">Vendor distribution</h2>
              <p className="text-sm text-slate-400">Most common OEMs in the monitored OT estate.</p>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendorData} margin={{ top: 8, right: 0, left: -12, bottom: 0 }}>
                <CartesianGrid stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} interval={0} height={60} />
                <YAxis tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3 text-slate-100">
            <CircleDot className="h-5 w-5 text-cyan-300" />
            <div>
              <h2 className="text-lg font-semibold">Online vs offline</h2>
              <p className="text-sm text-slate-400">Operational availability across the OT estate.</p>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={operationalData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={58} outerRadius={94} paddingAngle={3} stroke="transparent">
                  {operationalData.map((entry) => (
                    <Cell key={entry.name} fill={entry.name === "Online" ? chartColors.online : entry.name === "Offline" ? chartColors.offline : chartColors.maintenance} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} />
                <Legend wrapperStyle={{ color: "#cbd5e1", paddingTop: 16 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3 text-slate-100">
            <AlertTriangle className="h-5 w-5 text-cyan-300" />
            <div>
              <h2 className="text-lg font-semibold">Risk heatmap</h2>
              <p className="text-sm text-slate-400">Count of assets by vendor and risk level.</p>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid stroke="#1e293b" />
                <XAxis dataKey="x" type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} ticks={Array.from(new Set(riskHeatmapData.map((entry) => entry.x))).map(Number)} tickFormatter={(value) => {
                  const vendor = Array.from(new Set(riskHeatmapData.map((entry) => entry.vendor)))[value];
                  return vendor || "";
                }} />
                <YAxis dataKey="y" type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} ticks={[0, 1, 2, 3]} tickFormatter={(value) => ["Low", "Medium", "High", "Critical"][value] ?? ""} />
                <ZAxis dataKey="size" range={[100, 400]} />
                <Tooltip cursor={{ stroke: "#60a5fa", strokeDasharray: "3 3" }} contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} formatter={(value) => [value, "Severity count"]} />
                <Scatter data={riskHeatmapData} fill="#38bdf8" shape={(props) => {
                  const { cx, cy, size, payload } = props;
                  return <rect x={cx - size / 2} y={cy - size / 2} width={size} height={size} rx={6} fill={payload.color} />;
                }} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3 text-slate-100">
            <BarChart3 className="h-5 w-5 text-cyan-300" />
            <div>
              <h2 className="text-lg font-semibold">Risk score distribution</h2>
              <p className="text-sm text-slate-400">Risk category counts for the current asset estate.</p>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={criticalityData} margin={{ top: 8, right: 0, left: -12, bottom: 5 }}>
                <CartesianGrid stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#38bdf8">
                  {criticalityData.map((entry) => (
                    <Cell key={entry.name} fill={entry.name === "Critical" ? chartColors.critical : entry.name === "High" ? chartColors.high : entry.name === "Medium" ? chartColors.medium : chartColors.low} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3 text-slate-100">
            <Signal className="h-5 w-5 text-cyan-300" />
            <div>
              <h2 className="text-lg font-semibold">Recent security events</h2>
              <p className="text-sm text-slate-400">Tracked alerts and status updates.</p>
            </div>
          </div>
          <div className="space-y-4">
            {recentSecurityEvents.map((event) => (
              <article key={event.id} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{event.asset}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{event.summary}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusBadgeStyles[event.status] || "bg-slate-500/10 text-slate-200 ring-slate-500/30"}`}>{event.status}</span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-2 text-xs text-slate-500">
                  <span>{new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(event.date))}</span>
                  <span className="inline-flex items-center gap-2"><span className="font-semibold text-slate-300">{event.severity}</span> severity</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
