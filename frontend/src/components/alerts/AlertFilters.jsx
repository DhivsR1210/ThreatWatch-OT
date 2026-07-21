import { Search } from "lucide-react";

function AlertFilters({ filters, onChange }) {
  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_11rem_12rem]">
      <label className="relative min-w-0">
        <span className="sr-only">Search alerts</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          className="glass-control w-full rounded-2xl border py-3 pl-11 pr-4 text-sm text-slate-100 outline-none placeholder:text-slate-600"
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          placeholder="Search title, asset, source, or MITRE technique"
          value={filters.search}
        />
      </label>
      <select aria-label="Filter alerts by severity" className="glass-control rounded-2xl border px-3 py-3 text-sm text-slate-200 outline-none" onChange={(event) => onChange({ ...filters, severity: event.target.value })} value={filters.severity}>
        <option value="">All severities</option>
        <option value="Critical">Critical</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <select aria-label="Filter alerts by status" className="glass-control rounded-2xl border px-3 py-3 text-sm text-slate-200 outline-none" onChange={(event) => onChange({ ...filters, status: event.target.value })} value={filters.status}>
        <option value="">All statuses</option>
        <option value="New">New</option>
        <option value="Investigating">Investigating</option>
        <option value="Contained">Contained</option>
        <option value="Closed">Closed</option>
      </select>
    </div>
  );
}

export default AlertFilters;
