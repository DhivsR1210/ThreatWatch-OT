import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, LogOut, ShieldCheck, SlidersHorizontal } from "lucide-react";

import NavigationSidebar from "../components/NavigationSidebar";
import { useAuth } from "../contexts/AuthContext";

function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const pageLabel = {
    "/dashboard": "Dashboard",
    "/assets": "Assets",
    "/analytics": "Threats",
    "/reports": "Reports",
    "/settings": "Settings",
  }[location.pathname] || "Overview";

  async function handleSignOut() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-[#050a16] text-slate-100">
      <NavigationSidebar sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="sm:pl-72">
        {sidebarOpen && <button className="fixed inset-0 z-20 bg-slate-950/60 sm:hidden" onClick={() => setSidebarOpen(false)} type="button" aria-label="Close sidebar overlay" />}

        <header className="sticky top-0 z-10 border-b border-slate-800/80 bg-[#050a16]/95 backdrop-blur">
          <div className="mx-auto flex h-16 items-center justify-between gap-3 px-4 text-slate-100 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-300 shadow-sm shadow-cyan-500/10 transition hover:bg-slate-800 sm:hidden" onClick={() => setSidebarOpen(true)} type="button" aria-label="Open navigation menu">
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{pageLabel}</p>
                <p className="text-lg font-semibold text-slate-100">Operational technology security</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-end text-right sm:flex sm:flex-col">
                <span className="text-sm font-semibold text-slate-100">{user?.first_name} {user?.last_name}</span>
                <span className="text-xs text-slate-500">SecOps analyst</span>
              </div>
              <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-300 transition hover:bg-slate-800" onClick={handleSignOut} type="button" aria-label="Sign out">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;
