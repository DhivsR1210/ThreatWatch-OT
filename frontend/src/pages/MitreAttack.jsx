import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Crosshair, Filter, Search, ShieldCheck } from "lucide-react";

import MitreDrawer from "../components/mitre/MitreDrawer";
import { useMitreTechniques } from "../hooks/useMitreTechniques";

function MitreAttack() {
  const { techniques, error, isLoading, loadTechniques } = useMitreTechniques();
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("technique") || "");
  const [tactic, setTactic] = useState("");
  const [platform, setPlatform] = useState("");
  const [selectedTechnique, setSelectedTechnique] = useState(null);

  const tactics = useMemo(() => [...new Set(techniques.map((technique) => technique.tactic))].sort(), [techniques]);
  const platforms = useMemo(() => [...new Set(techniques.flatMap((technique) => technique.platforms))].sort(), [techniques]);
  const filteredTechniques = useMemo(() => {
    const term = keyword.trim().toLowerCase();
    return techniques.filter((technique) => {
      const searchable = [technique.technique_id, technique.name, technique.description, technique.tactic, ...technique.platforms].join(" ").toLowerCase();
      return (!term || searchable.includes(term)) && (!tactic || technique.tactic === tactic) && (!platform || technique.platforms.includes(platform));
    });
  }, [keyword, platform, tactic, techniques]);

  useEffect(() => {
    const requested = searchParams.get("technique");
    if (requested) setSelectedTechnique(techniques.find((technique) => technique.technique_id.toLowerCase() === requested.toLowerCase()) || null);
  }, [searchParams, techniques]);

  return (
    <div className="space-y-7">
      <section className="glass-panel rounded-3xl border p-7 sm:p-8"><div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">Threat-informed defense</p><h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">MITRE ATT&CK for ICS</h1><p className="mt-3 text-sm leading-7 text-slate-400">Map active OT detections to ICS adversary behaviors and prioritize detection and mitigation work with operational context.</p></div><button className="glass-subpanel inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold text-cyan-100" onClick={() => loadTechniques()} type="button"><ShieldCheck className="h-4 w-4" />Refresh catalog</button></div></section>
      <section className="grid gap-4 sm:grid-cols-3"><Kpi icon={Crosshair} label="Techniques" tone="text-cyan-200" value={techniques.length} /><Kpi icon={Filter} label="Tactics" tone="text-violet-200" value={tactics.length} /><Kpi icon={ShieldCheck} label="Linked alerts" tone="text-amber-100" value={techniques.reduce((total, technique) => total + technique.related_alerts.length, 0)} /></section>
      <section className="glass-panel rounded-3xl border p-5 sm:p-6"><div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_12rem_13rem]"><label className="relative"><span className="sr-only">Search MITRE techniques</span><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input className="glass-control w-full rounded-2xl border py-3 pl-11 pr-4 text-sm text-slate-100 outline-none placeholder:text-slate-600" onChange={(event) => setKeyword(event.target.value)} placeholder="Search technique ID, tactic, platform, or keyword" value={keyword} /></label><select aria-label="Filter techniques by tactic" className="glass-control rounded-2xl border px-3 py-3 text-sm text-slate-200 outline-none" onChange={(event) => setTactic(event.target.value)} value={tactic}><option value="">All tactics</option>{tactics.map((item) => <option key={item}>{item}</option>)}</select><select aria-label="Filter techniques by platform" className="glass-control rounded-2xl border px-3 py-3 text-sm text-slate-200 outline-none" onChange={(event) => setPlatform(event.target.value)} value={platform}><option value="">All platforms</option>{platforms.map((item) => <option key={item}>{item}</option>)}</select></div></section>
      {error && <div className="rounded-3xl border border-rose-400/25 bg-rose-400/10 p-4 text-sm text-rose-100">{error}</div>}
      {isLoading ? <div className="glass-panel rounded-3xl border p-10 text-center text-sm text-slate-400">Loading MITRE ATT&CK for ICS techniques…</div> : <section className="glass-panel overflow-hidden rounded-3xl border"><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm text-slate-300"><thead className="border-b border-white/10 text-xs uppercase tracking-[0.18em] text-slate-500"><tr><th className="px-5 py-4">Technique</th><th className="px-5 py-4">Name</th><th className="px-5 py-4">Tactic</th><th className="px-5 py-4">Platforms</th><th className="px-5 py-4">Related alerts</th></tr></thead><tbody className="divide-y divide-white/[0.07]">{filteredTechniques.map((technique) => <tr key={technique.technique_id} className="cursor-pointer" onClick={() => setSelectedTechnique(technique)}><td className="px-5 py-4"><span className="rounded-full bg-cyan-400/15 px-2.5 py-1 font-mono text-xs font-semibold text-cyan-100 ring-1 ring-inset ring-cyan-300/25">{technique.technique_id}</span></td><td className="px-5 py-4"><p className="font-semibold text-slate-100">{technique.name}</p><p className="mt-1 max-w-md truncate text-xs text-slate-500">{technique.description}</p></td><td className="px-5 py-4 text-slate-300">{technique.tactic}</td><td className="px-5 py-4 text-slate-400">{technique.platforms.join(", ")}</td><td className="px-5 py-4"><span className={technique.related_alerts.length ? "font-semibold text-amber-100" : "text-slate-500"}>{technique.related_alerts.length}</span></td></tr>)}{filteredTechniques.length === 0 && <tr><td className="px-5 py-14 text-center text-slate-500" colSpan="5">No techniques match the current filters.</td></tr>}</tbody></table></div><div className="border-t border-white/10 px-5 py-4 text-sm text-slate-400">Showing <span className="font-medium text-slate-200">{filteredTechniques.length}</span> of <span className="font-medium text-slate-200">{techniques.length}</span> techniques</div></section>}
      <MitreDrawer technique={selectedTechnique} onClose={() => setSelectedTechnique(null)} />
    </div>
  );
}

function Kpi({ icon: Icon, label, value, tone }) {
  return <article className="glass-panel rounded-3xl border p-5"><div className="flex items-center justify-between"><p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">{label}</p><span className={`glass-subpanel grid h-10 w-10 place-items-center rounded-2xl ${tone}`}><Icon className="h-4 w-4" /></span></div><p className="mt-5 text-3xl font-semibold text-white">{value}</p></article>;
}

export default MitreAttack;
