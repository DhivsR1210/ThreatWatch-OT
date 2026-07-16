function AssetFilters({ filters, onChange }) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">Search assets</span>
        <svg aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" strokeLinecap="round" strokeWidth="2" /></svg>
        <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-9 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" onChange={(event) => onChange({ ...filters, search: event.target.value })} placeholder="Search name, vendor, IP address, or location" value={filters.search} />
      </label>
      <select aria-label="Filter by criticality" className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-400" onChange={(event) => onChange({ ...filters, criticality: event.target.value })} value={filters.criticality}>
        <option value="">All criticality</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Critical">Critical</option>
      </select>
      <select aria-label="Filter by operational status" className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-400" onChange={(event) => onChange({ ...filters, status: event.target.value })} value={filters.status}>
        <option value="">All status</option>
        <option value="Online">Online</option>
        <option value="Offline">Offline</option>
        <option value="Maintenance">Maintenance</option>
      </select>
    </div>
  );
}

export default AssetFilters;
