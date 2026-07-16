import { useMemo } from "react";
import { AlertTriangle, Clock3, ShieldCheck } from "lucide-react";

import { recentSecurityEvents } from "../data/seedData";
import { useAssets } from "../hooks/useAssets";
import { statusBadgeStyles } from "../data/seedData";

function Analytics() {
  const { assets } = useAssets();

  const openIncidents = useMemo(
    () => recentSecurityEvents.filter((event) => event.status === "Investigating" || event.status === "Reviewing").length,
    [],
  );

  const totalEvents = recentSecurityEvents.length;
  const alertSummary = useMemo(() => {
    const counts = { Critical: 0, High: 0, Medium: 0 };
    recentSecurityEvents.forEach((event) => {
      if (counts[event.severity] !== undefined) counts[event.severity] += 1;
    });
    return counts;
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Threat intelligence</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">Industrial risk overview</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Track active alerts, incident severity, and event patterns for OT infrastructure security teams.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Monitored assets</p>
              <p className="mt-3 text-3xl font-semibold text-white">{assets.length}</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Open incidents</p>
              <p className="mt-3 text-3xl font-semibold text-white">{openIncidents}</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Threat events</p>
              <p className="mt-3 text-3xl font-semibold text-white">{totalEvents}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-slate-100">
            <AlertTriangle className="h-5 w-5 text-rose-400" />
            <h2 className="text-lg font-semibold">Active alert breakdown</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {Object.entries(alertSummary).map(([severity, count]) => (
              <div key={severity} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                <p className="text-sm text-slate-400">{severity}</p>
                <p className={`mt-3 text-2xl font-semibold ${severity === "Critical" ? "text-rose-400" : severity === "High" ? "text-orange-300" : "text-amber-300"}`}>{count}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-slate-100">
            <ShieldCheck className="h-5 w-5 text-cyan-300" />
            <h2 className="text-lg font-semibold">Event timeline</h2>
          </div>
          <div className="mt-5 space-y-4">
            {recentSecurityEvents.map((event) => (
              <div key={event.id} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{event.summary}</p>
                    <p className="mt-1 text-xs text-slate-500">{event.asset}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-slate-800 px-2.5 py-1 text-slate-300">{new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(event.date))}</span>
                    <span className="rounded-full bg-slate-800 px-2.5 py-1 text-slate-300">{event.severity}</span>
                    <span className={`rounded-full px-2.5 py-1 text-slate-300 ring-1 ring-inset ${statusBadgeStyles[event.status] || "bg-slate-500/10 text-slate-300 ring-slate-500/30"}`}>{event.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-sm">
        <div className="flex items-center gap-3 text-slate-100">
          <Clock3 className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold">Operational recommendations</h2>
        </div>
        <ul className="mt-5 space-y-3 text-sm text-slate-400">
          <li className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">Review configuration changes for the Honeywell SCADA Server to verify segmentation rules remain enforced.</li>
          <li className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">Confirm network isolation for the Cisco Industrial Switch and validate device discovery policies.</li>
          <li className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">Inspect the ABB HMI Panel authentication logs after the failed login attempts in the last 12 hours.</li>
        </ul>
      </section>
    </div>
  );
}

export default Analytics;
