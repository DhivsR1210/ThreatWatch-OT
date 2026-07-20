import { Link, useLocation } from "react-router-dom";
import { Activity, Cpu, FileText, ShieldCheck, SlidersHorizontal } from "lucide-react";

const links = [
  { label: "Dashboard", to: "/dashboard", icon: Activity },
  { label: "Assets", to: "/assets", icon: Cpu },
  { label: "Threat Intelligence", to: "/threat-intelligence", icon: ShieldCheck },
  { label: "Threats", to: "/analytics", icon: FileText },
  { label: "Reports", to: "/reports", icon: FileText },
  { label: "Settings", to: "/settings", icon: SlidersHorizontal },
];

function NavigationSidebar({ sidebarOpen, onClose }) {
  const location = useLocation();

  return (
    <aside className={`glass-sidebar fixed inset-y-0 left-0 z-30 flex w-72 flex-col transition-transform duration-300 ease-in-out sm:inset-y-4 sm:left-4 sm:rounded-3xl ${sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`}>
      <div className="flex flex-shrink-0 items-center justify-between gap-4 border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="glass-action grid h-11 w-11 place-items-center rounded-2xl bg-cyan-300 text-sm font-black text-slate-950">TW</div>
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
              <Link key={item.to} to={item.to} className={`glass-nav-link group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? "glass-nav-link-active text-cyan-200" : "text-slate-300 hover:text-slate-100"}`}>
                <Icon className="h-5 w-5 text-current" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="glass-subpanel mt-auto rounded-3xl border p-4 text-sm text-slate-400">
          <p className="font-semibold text-slate-100">Operational visibility</p>
          <p className="mt-2 text-xs leading-5">Monitor asset health, network signal, and active threats from one secure command center.</p>
        </div>
      </nav>
    </aside>
  );
}

export default NavigationSidebar;
