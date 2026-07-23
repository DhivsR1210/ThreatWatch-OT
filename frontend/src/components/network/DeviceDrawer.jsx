import { AlertTriangle, ShieldAlert, X } from "lucide-react";

function DeviceDrawer({ device, onClose }) {
  if (!device) return null;

  const statusClass = device.status === "Online" ? "bg-emerald-400/15 text-emerald-100 ring-emerald-300/30" : device.status === "Maintenance" ? "bg-amber-400/15 text-amber-100 ring-amber-300/30" : "bg-rose-400/15 text-rose-100 ring-rose-300/30";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/55 backdrop-blur-sm" onClick={onClose} role="presentation">
      <aside aria-label="Device details" aria-modal="true" className="glass-sidebar flex h-full w-full max-w-xl flex-col border-l p-5 shadow-2xl sm:p-7" onClick={(event) => event.stopPropagation()} role="dialog">
        <div className="flex items-start justify-between gap-5 border-b border-white/10 pb-5"><div><p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">OT device</p><h2 className="mt-3 text-2xl font-semibold text-white">{device.label}</h2><p className="mt-2 text-sm text-slate-400">{device.type} · {device.vendor}</p></div><button aria-label="Close device details" className="glass-subpanel inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-slate-300" onClick={onClose} type="button"><X className="h-5 w-5" /></button></div>
        <div className="flex flex-wrap gap-2 pt-5"><Badge className={statusClass} value={device.status} /><Badge className="bg-cyan-400/15 text-cyan-100 ring-cyan-300/30" value={`${device.criticality} criticality`} /></div>
        <dl className="mt-7 grid gap-5 sm:grid-cols-2"><Detail label="Vendor" value={device.vendor} /><Detail label="Model" value={device.model} /><Detail label="IP address" value={device.ip} mono /><Detail label="Firmware" value={device.firmware} /></dl>
        <div className="mt-7 grid gap-4 sm:grid-cols-2"><ExposureCard icon={ShieldAlert} label="Open vulnerabilities" tone="text-amber-200" value={device.openVulnerabilities} /><ExposureCard icon={AlertTriangle} label="Active alerts" tone="text-rose-200" value={device.activeAlerts} /></div>
        <div className="glass-panel mt-7 rounded-2xl border p-4"><p className="text-sm font-semibold text-slate-100">Operator context</p><p className="mt-2 text-sm leading-6 text-slate-400">Review this device's open exposures and alerts before making changes to connected industrial systems.</p></div>
      </aside>
    </div>
  );
}

function Detail({ label, value, mono = false }) {
  return <div><dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</dt><dd className={`mt-2 text-sm font-medium text-slate-200 ${mono ? "font-mono" : ""}`}>{value}</dd></div>;
}

function ExposureCard({ icon: Icon, label, tone, value }) {
  return <div className="glass-panel rounded-2xl border p-4"><div className={`flex items-center gap-2 ${tone}`}><Icon className="h-4 w-4" /><p className="text-xs font-semibold uppercase tracking-[0.16em]">{label}</p></div><p className="mt-3 text-3xl font-semibold text-white">{value}</p></div>;
}

function Badge({ className, value }) {
  return <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${className}`}>{value}</span>;
}

export default DeviceDrawer;
