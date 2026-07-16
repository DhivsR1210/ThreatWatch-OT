function Reports() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-white">Reports</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">View audit summaries, compliance dashboards, and threat intelligence exports for the OT environment.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Weekly posture</p>
          <p className="mt-4 text-sm text-slate-300">Performance indicators, incident response timelines, and risk vector tracking for the current operations week.</p>
        </article>
        <article className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Compliance audit</p>
          <p className="mt-4 text-sm text-slate-300">Export a single compliance package covering access control, network segmentation, and asset hardening status.</p>
        </article>
        <article className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Incident summary</p>
          <p className="mt-4 text-sm text-slate-300">Track recent events and operator actions to ensure root cause analysis is preserved for audit readiness.</p>
        </article>
      </div>
    </section>
  );
}

export default Reports;
