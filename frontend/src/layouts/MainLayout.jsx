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
    <div className="liquid-shell text-slate-100">
      <NavigationSidebar sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="sm:pl-[19rem]">
        {sidebarOpen && <button className="fixed inset-0 z-20 bg-slate-950/60 sm:hidden" onClick={() => setSidebarOpen(false)} type="button" aria-label="Close sidebar overlay" />}

        <header className="glass-header sticky top-3 z-10 mx-3 rounded-3xl border sm:top-4 sm:mx-4">
          <div className="mx-auto flex h-16 items-center justify-between gap-3 px-4 text-slate-100 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button className="glass-subpanel inline-flex h-11 w-11 items-center justify-center rounded-2xl border text-slate-300 transition sm:hidden" onClick={() => setSidebarOpen(true)} type="button" aria-label="Open navigation menu">
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
              <button className="glass-subpanel inline-flex h-11 w-11 items-center justify-center rounded-2xl border text-slate-300 transition" onClick={handleSignOut} type="button" aria-label="Sign out">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;
