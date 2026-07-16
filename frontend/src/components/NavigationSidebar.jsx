import { Link, useLocation } from "react-router-dom";
import { Activity, Cpu, FileText, ShieldCheck, SlidersHorizontal } from "lucide-react";

const links = [
  { label: "Dashboard", to: "/dashboard", icon: Activity },
  { label: "Assets", to: "/assets", icon: Cpu },
  { label: "Threats", to: "/analytics", icon: ShieldCheck },
  { label: "Reports", to: "/analytics", icon: FileText },
  { label: "Settings", to: "/settings", icon: SlidersHorizontal },
];

function NavigationSidebar({ sidebarOpen, onClose }) {
  const location = useLocation();

  return (
    <aside className={`fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-slate-800 bg-[#07111f] transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`}>
      <div className="flex flex-shrink-0 items-center justify-between gap-4 border-b border-slate-800 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-400 text-sm font-black text-slate-950">TW</div>
          <div>
            <p className="text-sm font-semibold text-slate-100">ThreatWatch OT</p>
            <p className="text-xs text-slate-500">Cyber operations center</p>
          </div>
        </div>
        <button className="sm:hidden text-slate-400 hover:text-slate-100" onClick={onClose} type="button" aria-label="Close navigation">
          ×
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        <p className="px-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Navigation</p>
        <div className="space-y-1">
          {links.map((item) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to} className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? "bg-cyan-400/10 text-cyan-300 shadow-sm shadow-cyan-500/10" : "text-slate-300 hover:bg-white/5 hover:text-slate-100"}`}>
                <Icon className="h-5 w-5 text-current" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto rounded-3xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">
          <p className="font-semibold text-slate-100">Operational visibility</p>
          <p className="mt-2 text-xs leading-5">Monitor asset health, network signal, and active threats from one secure command center.</p>
        </div>
      </nav>
    </aside>
  );
}

export default NavigationSidebar;
