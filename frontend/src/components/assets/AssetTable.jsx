const criticalityStyles = {
  Low: "bg-sky-400/10 text-sky-200 ring-sky-400/20",
  Medium: "bg-amber-400/10 text-amber-200 ring-amber-400/20",
  High: "bg-orange-400/10 text-orange-200 ring-orange-400/20",
  Critical: "bg-rose-400/10 text-rose-200 ring-rose-400/20",
};

const statusStyles = {
  Online: "bg-emerald-400",
  Offline: "bg-slate-500",
  Maintenance: "bg-amber-400",
};

function formatLastSeen(value) {
  if (!value) return "Not observed";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function AssetTable({ assets, onDelete, onEdit }) {
  if (!assets.length) {
    return <div className="grid min-h-64 place-items-center px-6 text-center text-sm text-slate-500">No assets match the current inventory filters.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] text-left text-sm">
        <thead className="border-y border-slate-800 bg-slate-950/40 text-xs uppercase tracking-wider text-slate-500">
          <tr><th className="px-5 py-3 font-medium">Asset</th><th className="px-5 py-3 font-medium">Network identity</th><th className="px-5 py-3 font-medium">Location</th><th className="px-5 py-3 font-medium">Criticality</th><th className="px-5 py-3 font-medium">Risk</th><th className="px-5 py-3 font-medium">Last seen</th><th className="px-5 py-3 font-medium"><span className="sr-only">Actions</span></th></tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80">
          {assets.map((asset) => (
            <tr className="transition hover:bg-slate-800/30" key={asset.id}>
              <td className="px-5 py-4"><p className="font-medium text-slate-100">{asset.asset_name}</p><p className="mt-1 text-xs text-slate-500">{asset.vendor || "Unknown vendor"} · {asset.asset_type}</p></td>
              <td className="px-5 py-4 text-slate-300"><p>{asset.ip_address || "No IP assigned"}</p><p className="mt-1 font-mono text-xs text-slate-500">{asset.mac_address || "No MAC recorded"}</p></td>
              <td className="px-5 py-4 text-slate-300">{asset.plant_location || "Unassigned"}</td>
              <td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${criticalityStyles[asset.criticality]}`}>{asset.criticality}</span><p className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-400"><span className={`inline-block h-2.5 w-2.5 rounded-full ${statusStyles[asset.operational_status]}`} />{asset.operational_status}</p></td>
              <td className="px-5 py-4"><div className="flex items-center gap-2"><div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-800"><div className={asset.risk_score >= 75 ? "h-full bg-rose-400" : asset.risk_score >= 50 ? "h-full bg-amber-400" : "h-full bg-emerald-400"} style={{ width: `${asset.risk_score}%` }} /></div><span className="font-medium text-slate-200">{asset.risk_score}</span></div></td>
              <td className="px-5 py-4 text-xs text-slate-400">{formatLastSeen(asset.last_seen)}</td>
              <td className="px-5 py-4"><div className="flex justify-end gap-2"><button className="rounded-md px-2 py-1 text-xs font-medium text-cyan-300 hover:bg-cyan-400/10" onClick={() => onEdit(asset)} type="button">Edit</button><button className="rounded-md px-2 py-1 text-xs font-medium text-rose-300 hover:bg-rose-400/10" onClick={() => onDelete(asset)} type="button">Delete</button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AssetTable;
