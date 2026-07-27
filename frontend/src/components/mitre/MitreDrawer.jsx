import { Link } from "react-router-dom";
import { ShieldCheck, X } from "lucide-react";

function MitreDrawer({ technique, onClose }) {
  if (!technique) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/55 backdrop-blur-sm" onClick={onClose} role="presentation">
      <aside aria-label="MITRE technique details" aria-modal="true" className="glass-sidebar flex h-full w-full max-w-2xl flex-col border-l p-5 shadow-2xl sm:p-7" onClick={(event) => event.stopPropagation()} role="dialog">
        <div className="flex items-start justify-between gap-5 border-b border-white/10 pb-5"><div><p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">MITRE ATT&CK for ICS</p><h2 className="mt-3 text-2xl font-semibold leading-tight text-white">{technique.name}</h2><span className="mt-3 inline-flex rounded-full bg-cyan-400/15 px-3 py-1.5 text-sm font-semibold text-cyan-100 ring-1 ring-inset ring-cyan-300/30">{technique.technique_id}</span></div><button aria-label="Close MITRE technique details" className="glass-subpanel inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-slate-300" onClick={onClose} type="button"><X className="h-5 w-5" /></button></div>
        <div className="mt-6 space-y-6 overflow-y-auto pr-1"><Detail label="Description"><p className="leading-7 text-slate-300">{technique.description}</p></Detail><dl className="grid gap-5 sm:grid-cols-2"><Detail label="Tactic">{technique.tactic}</Detail><Detail label="Platform"><div className="flex flex-wrap gap-2">{technique.platforms.map((platform) => <span key={platform} className="rounded-full bg-slate-800/70 px-2.5 py-1 text-xs text-slate-200 ring-1 ring-inset ring-white/10">{platform}</span>)}</div></Detail></dl><Detail label="Detection guidance"><p className="leading-7 text-slate-300">{technique.detection_guidance}</p></Detail><Detail label="Mitigation"><p className="leading-7 text-slate-300">{technique.mitigation}</p></Detail><RelatedAlerts alerts={technique.related_alerts} /><Detail label="Related OT assets"><div className="flex flex-wrap gap-2">{technique.related_assets.length ? technique.related_assets.map((asset) => <span key={asset} className="rounded-full bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-100 ring-1 ring-inset ring-cyan-300/20">{asset}</span>) : <span className="text-slate-500">No current assets linked.</span>}</div></Detail><div className="glass-panel rounded-2xl border p-4"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" /><p className="text-sm leading-6 text-slate-400">Technique context is linked to current SOC alerts so analysts can prioritize detection and mitigation work against active OT exposure.</p></div></div></div>
      </aside>
    </div>
  );
}

function Detail({ label, children }) {
  return <div><h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</h3><div className="mt-2 text-sm font-medium text-slate-200">{children}</div></div>;
}

function RelatedAlerts({ alerts }) {
  return <Detail label="Related alerts"><div className="space-y-2">{alerts.length ? alerts.map((alert) => <Link key={alert.id} className="glass-subpanel flex items-center justify-between gap-3 rounded-xl border px-3 py-3 text-sm transition hover:border-cyan-300/30" to="/alerts"><span className="font-medium text-slate-100">{alert.title}</span><span className="shrink-0 text-xs text-slate-400">{alert.asset}</span></Link>) : <span className="text-slate-500">No current SOC alerts linked.</span>}</div></Detail>;
}

export default MitreDrawer;
