import { Clock3, ShieldAlert, X } from "lucide-react";
import { Link } from "react-router-dom";

import { severityStyles, statusStyles } from "./alertStyles";

function AlertDrawer({ alert, onClose }) {
  if (!alert) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/55 backdrop-blur-sm" onClick={onClose} role="presentation">
      <aside aria-label="Alert details" aria-modal="true" className="glass-sidebar flex h-full w-full max-w-xl flex-col border-l p-5 shadow-2xl sm:p-7" onClick={(event) => event.stopPropagation()} role="dialog">
        <div className="flex items-start justify-between gap-5 border-b border-white/10 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">SOC alert</p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight text-white">{alert.title}</h2>
          </div>
          <button aria-label="Close alert details" className="glass-subpanel inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-slate-300" onClick={onClose} type="button"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex flex-wrap gap-2 pt-5"><Badge styles={severityStyles} value={alert.severity} /><Badge styles={statusStyles} value={alert.status} /></div>
        <div className="mt-6 space-y-6 overflow-y-auto pr-1">
          <Detail label="Description"><p className="leading-7 text-slate-300">{alert.description}</p></Detail>
          <dl className="grid gap-4 sm:grid-cols-2">
            <Detail label="Affected asset">{alert.asset}</Detail>
            <Detail label="Detection source">{alert.source}</Detail>
            <Detail label="MITRE technique">{alert.mitreTechnique ? <Link className="font-mono text-cyan-200 underline-offset-4 hover:text-cyan-100 hover:underline" to={`/mitre?technique=${encodeURIComponent(alert.mitreTechnique)}`}>{alert.mitreTechnique}</Link> : "Not mapped"}</Detail>
            <Detail label="Detected"><span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-cyan-300" />{formatTimestamp(alert.timestamp)}</span></Detail>
          </dl>
          <div className="glass-panel rounded-2xl border p-4"><div className="flex items-center gap-3"><ShieldAlert className="h-5 w-5 text-cyan-300" /><div><p className="font-semibold text-slate-100">Triage guidance</p><p className="mt-1 text-sm leading-6 text-slate-400">Validate the source and asset context, preserve relevant evidence, and follow the established OT incident response runbook.</p></div></div></div>
        </div>
      </aside>
    </div>
  );
}

function Detail({ label, children }) {
  return <div><dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</dt><dd className="mt-2 text-sm font-medium text-slate-200">{children}</dd></div>;
}

function Badge({ value, styles }) {
  return <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${styles[value] || "bg-slate-400/15 text-slate-200 ring-slate-300/30"}`}>{value}</span>;
}

function formatTimestamp(timestamp) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "full", timeStyle: "short" }).format(new Date(timestamp));
}

export default AlertDrawer;
