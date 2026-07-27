import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Link } from "react-router-dom";

import { severityStyles, statusStyles } from "./alertStyles";

function AlertTable({ alerts, onSelect, page, pageCount, onPageChange, sort, onSort, total }) {
  const columns = [
    ["severity", "Severity"],
    ["title", "Alert"],
    ["asset", "Asset"],
    ["source", "Source"],
    ["status", "Status"],
    ["timestamp", "Detected"],
  ];

  return (
    <section className="glass-panel overflow-hidden rounded-3xl border">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[940px] text-left text-sm text-slate-300">
          <thead className="border-b border-white/10 text-xs uppercase tracking-[0.18em] text-slate-500">
            <tr>
              {columns.map(([key, label]) => <SortableHeader key={key} label={label} sort={sort} sortKey={key} onSort={onSort} />)}
              <th className="px-5 py-4"><span className="sr-only">Open alert details</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.07]">
            {alerts.map((alert) => (
              <tr key={alert.id} className="group cursor-pointer" onClick={() => onSelect(alert)}>
                <td className="px-5 py-4"><Badge styles={severityStyles} value={alert.severity} /></td>
                <td className="max-w-xs px-5 py-4"><p className="font-semibold text-slate-100">{alert.title}</p>{alert.mitreTechnique ? <Link className="mt-1 inline-flex text-xs font-semibold text-cyan-200 underline-offset-4 hover:text-cyan-100 hover:underline" onClick={(event) => event.stopPropagation()} to={`/mitre?technique=${encodeURIComponent(alert.mitreTechnique)}`}>{alert.mitreTechnique}</Link> : <p className="mt-1 truncate text-xs text-slate-500">No MITRE technique mapped</p>}</td>
                <td className="px-5 py-4 text-slate-200">{alert.asset}</td>
                <td className="px-5 py-4 text-slate-400">{alert.source}</td>
                <td className="px-5 py-4"><Badge styles={statusStyles} value={alert.status} /></td>
                <td className="whitespace-nowrap px-5 py-4 text-slate-400">{formatTimestamp(alert.timestamp)}</td>
                <td className="px-5 py-4 text-right"><button aria-label={`View details for ${alert.title}`} className="glass-subpanel inline-flex h-9 w-9 items-center justify-center rounded-xl border text-cyan-200 opacity-80 transition group-hover:opacity-100" onClick={(event) => { event.stopPropagation(); onSelect(alert); }} type="button"><Eye className="h-4 w-4" /></button></td>
              </tr>
            ))}
            {alerts.length === 0 && <tr><td className="px-5 py-14 text-center text-slate-500" colSpan="7">No SOC alerts match the current filters.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-slate-400">Showing <span className="font-medium text-slate-200">{alerts.length}</span> of <span className="font-medium text-slate-200">{total}</span> alerts</p>
        <div className="flex items-center gap-2">
          <button aria-label="Previous page" className="glass-subpanel inline-flex h-9 w-9 items-center justify-center rounded-xl border text-slate-200 disabled:cursor-not-allowed disabled:opacity-40" disabled={page === 1} onClick={() => onPageChange(page - 1)} type="button"><ChevronLeft className="h-4 w-4" /></button>
          <span className="min-w-20 text-center text-xs font-medium text-slate-400">Page {page} / {pageCount}</span>
          <button aria-label="Next page" className="glass-subpanel inline-flex h-9 w-9 items-center justify-center rounded-xl border text-slate-200 disabled:cursor-not-allowed disabled:opacity-40" disabled={page === pageCount} onClick={() => onPageChange(page + 1)} type="button"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
    </section>
  );
}

function SortableHeader({ label, sort, sortKey, onSort }) {
  const active = sort.key === sortKey;
  const Icon = sort.direction === "asc" ? ArrowUp : ArrowDown;
  return <th className="px-5 py-4 font-medium"><button className="inline-flex items-center gap-1.5 transition hover:text-cyan-200" onClick={() => onSort(sortKey)} type="button">{label}{active && <Icon className="h-3.5 w-3.5" />}</button></th>;
}

function Badge({ value, styles }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[value] || "bg-slate-400/15 text-slate-200 ring-slate-300/30"}`}>{value}</span>;
}

function formatTimestamp(timestamp) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(timestamp));
}

export default AlertTable;
