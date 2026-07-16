import { useMemo, useState } from "react";
import { Activity, AlertTriangle, BarChart3, ChartPie, ShieldAlert, Sparkles, Bug } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useAssets } from "../hooks/useAssets";
import { useVulnerabilities } from "../hooks/useVulnerabilities";
import VulnerabilityTable from "../components/threat-intelligence/VulnerabilityTable";

const severityColors = {
  Critical: "#f43f5e",
  High: "#fb923c",
  Medium: "#f59e0b",
  Low: "#22d3ee",
};

function ThreatIntelligence() {
  const { vulnerabilities, error, isLoading } = useVulnerabilities();
  const { assets } = useAssets();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return vulnerabilities;
    const term = search.trim().toLowerCase();
    return vulnerabilities.filter((item) =>
      [item.cve_id, item.vendor, item.product, item.mitre_technique].some((field) => field?.toLowerCase().includes(term)),
    );
  }, [search, vulnerabilities]);

  const criticalCount = vulnerabilities.filter((item) => item.severity === "Critical").length;
  const highCount = vulnerabilities.filter((item) => item.severity === "High").length;
  const exploitCount = vulnerabilities.filter((item) => item.exploit_available).length;
  const atRiskVendors = useMemo(
    () => new Set(
      vulnerabilities
        .filter((item) => item.severity === "Critical" || item.severity === "High")
        .map((item) => item.vendor.toLowerCase()),
    ),
    [vulnerabilities],
  );
  const assetsAtRisk = assets.filter((asset) => atRiskVendors.has(asset.vendor?.toLowerCase())).length;

  const severityData = useMemo(() => {
    const counts = vulnerabilities.reduce((acc, item) => {
      acc[item.severity] = (acc[item.severity] || 0) + 1;
      return acc;
    }, {});
    return ["Critical", "High", "Medium", "Low"].map((label) => ({ name: label, value: counts[label] || 0 }));
  }, [vulnerabilities]);

  const vendorData = useMemo(() => {
    const counts = vulnerabilities.reduce((acc, item) => {
      acc[item.vendor] = (acc[item.vendor] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [vulnerabilities]);

  const cvssData = useMemo(() => {
    const buckets = { "0-3": 0, "3.1-6": 0, "6.1-8": 0, "8.1-10": 0 };
    vulnerabilities.forEach((item) => {
      if (item.cvss_score <= 3) buckets["0-3"] += 1;
      else if (item.cvss_score <= 6) buckets["3.1-6"] += 1;
      else if (item.cvss_score <= 8) buckets["6.1-8"] += 1;
      else buckets["8.1-10"] += 1;
    });
    return Object.entries(buckets).map(([name, value]) => ({ name, value }));
  }, [vulnerabilities]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-8 shadow-xl shadow-cyan-500/5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Threat intelligence</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Vulnerability management</h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">Track OT CVEs, known exploit availability, and vendor exposure across industrial infrastructure.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
              <p className="text-sm text-slate-400">Latest CVE events</p>
              <p className="mt-2 text-3xl font-semibold text-white">{vulnerabilities.length}</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
              <p className="text-sm text-slate-400">Vendor coverage</p>
              <p className="mt-2 text-3xl font-semibold text-white">{new Set(vulnerabilities.map((item) => item.vendor)).size}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Critical CVEs" value={criticalCount} icon={AlertTriangle} color="text-rose-300" />
        <KpiCard label="High CVEs" value={highCount} icon={BarChart3} color="text-orange-300" />
        <KpiCard label="Known exploits" value={exploitCount} icon={Sparkles} color="text-emerald-300" />
        <KpiCard label="Assets at risk" value={assetsAtRisk} icon={Bug} color="text-violet-300" />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3 text-slate-100">
            <ChartPie className="h-5 w-5 text-cyan-300" />
            <h2 className="text-lg font-semibold">Severity distribution</h2>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={severityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={50} paddingAngle={4} stroke="transparent">
                  {severityData.map((entry) => (
                    <Cell key={entry.name} fill={severityColors[entry.name]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ color: "#cbd5e1", paddingTop: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3 text-slate-100">
            <ShieldAlert className="h-5 w-5 text-cyan-300" />
            <h2 className="text-lg font-semibold">Vendor distribution</h2>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendorData} margin={{ top: 8, right: 0, left: -12, bottom: 20 }}>
                <CartesianGrid stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} interval={0} height={60} />
                <YAxis tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3 text-slate-100">
            <Activity className="h-5 w-5 text-cyan-300" />
            <h2 className="text-lg font-semibold">CVSS score distribution</h2>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cvssData} margin={{ top: 8, right: 0, left: -12, bottom: 5 }}>
                <CartesianGrid stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b" }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <div>
        <VulnerabilityTable vulnerabilities={filtered} onSearch={setSearch} searchTerm={search} />
      </div>

      {error && <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>}
      {isLoading && <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-slate-400">Loading vulnerability intelligence…</div>}
    </div>
  );
}

function KpiCard({ label, value, icon: Icon, color }) {
  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">{label}</p>
        <span className={`grid h-11 w-11 place-items-center rounded-2xl bg-slate-950/80 ${color}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-6 text-3xl font-semibold text-white">{value}</p>
    </article>
  );
}

export default ThreatIntelligence;
