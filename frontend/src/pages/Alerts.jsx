import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Radar, SearchCheck } from "lucide-react";

import AlertDrawer from "../components/alerts/AlertDrawer";
import AlertFilters from "../components/alerts/AlertFilters";
import AlertTable from "../components/alerts/AlertTable";
import { useAlerts } from "../hooks/useAlerts";

const PAGE_SIZE = 6;

function Alerts() {
  const { alerts, error, isLoading, loadAlerts } = useAlerts();
  const [filters, setFilters] = useState({ search: "", severity: "", status: "" });
  const [sort, setSort] = useState({ key: "timestamp", direction: "desc" });
  const [page, setPage] = useState(1);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const filteredAlerts = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    return alerts.filter((alert) => {
      const matchesSearch = !term || [alert.title, alert.description, alert.asset, alert.source, alert.mitreTechnique].some((value) => value?.toLowerCase().includes(term));
      return matchesSearch && (!filters.severity || alert.severity === filters.severity) && (!filters.status || alert.status === filters.status);
    });
  }, [alerts, filters]);

  const sortedAlerts = useMemo(() => [...filteredAlerts].sort((a, b) => {
    const left = sort.key === "timestamp" ? new Date(a[sort.key]).getTime() : String(a[sort.key] || "").toLowerCase();
    const right = sort.key === "timestamp" ? new Date(b[sort.key]).getTime() : String(b[sort.key] || "").toLowerCase();
    if (left < right) return sort.direction === "asc" ? -1 : 1;
    if (left > right) return sort.direction === "asc" ? 1 : -1;
    return 0;
  }), [filteredAlerts, sort]);

  const pageCount = Math.max(1, Math.ceil(sortedAlerts.length / PAGE_SIZE));
  const paginatedAlerts = sortedAlerts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const openCount = alerts.filter((alert) => alert.status === "New" || alert.status === "Investigating").length;
  const criticalCount = alerts.filter((alert) => alert.severity === "Critical").length;
  const containedCount = alerts.filter((alert) => alert.status === "Contained").length;

  useEffect(() => {
    setPage(1);
  }, [filters, sort]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  function handleSort(key) {
    setSort((current) => ({ key, direction: current.key === key && current.direction === "desc" ? "asc" : "desc" }));
  }

  return (
    <div className="space-y-7">
      <section className="glass-panel rounded-3xl border p-7 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">Security operations center</p><h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Alert center</h1><p className="mt-3 text-sm leading-7 text-slate-400">Review, prioritize, and investigate OT security detections across your monitored industrial environment.</p></div>
          <button className="glass-subpanel inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold text-cyan-100" onClick={() => loadAlerts()} type="button"><Radar className="h-4 w-4" />Refresh alerts</button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Total alerts" value={alerts.length} icon={Radar} tone="text-cyan-200" />
        <Kpi label="Open triage" value={openCount} icon={SearchCheck} tone="text-violet-200" />
        <Kpi label="Critical" value={criticalCount} icon={AlertTriangle} tone="text-rose-200" />
        <Kpi label="Contained" value={containedCount} icon={CheckCircle2} tone="text-emerald-200" />
      </section>

      <section className="glass-panel rounded-3xl border p-5 sm:p-6"><AlertFilters filters={filters} onChange={setFilters} /></section>
      {error && <div className="rounded-3xl border border-rose-400/25 bg-rose-400/10 p-4 text-sm text-rose-100">{error}</div>}
      {isLoading ? <div className="glass-panel rounded-3xl border p-10 text-center text-sm text-slate-400">Loading SOC alert intelligence…</div> : <AlertTable alerts={paginatedAlerts} onPageChange={setPage} onSelect={setSelectedAlert} onSort={handleSort} page={page} pageCount={pageCount} sort={sort} total={sortedAlerts.length} />}
      <AlertDrawer alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
    </div>
  );
}

function Kpi({ label, value, icon: Icon, tone }) {
  return <article className="glass-panel rounded-3xl border p-5"><div className="flex items-center justify-between gap-3"><p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">{label}</p><span className={`glass-subpanel grid h-11 w-11 place-items-center rounded-2xl ${tone}`}><Icon className="h-5 w-5" /></span></div><p className="mt-6 text-3xl font-semibold text-white">{value}</p></article>;
}

export default Alerts;
