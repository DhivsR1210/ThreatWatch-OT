import { Link } from "react-router-dom";

function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <main className="min-h-screen bg-[#070d19] px-4 py-8 text-slate-100 sm:px-6 lg:grid lg:grid-cols-2 lg:p-0">
      <section className="mx-auto flex w-full max-w-md flex-col justify-center py-8 lg:py-16">
        <Link className="mb-12 inline-flex items-center gap-3 text-lg font-semibold tracking-tight" to="/">
          <span className="grid size-9 place-items-center rounded-lg bg-cyan-400 font-black text-slate-950">TW</span>
          ThreatWatch <span className="font-normal text-slate-400">OT</span>
        </Link>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-6 text-center text-sm text-slate-400">{footer}</p>
        </div>
      </section>
      <aside className="relative hidden overflow-hidden border-l border-slate-800 bg-slate-950 lg:flex lg:flex-col lg:justify-end lg:p-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_20%_75%,rgba(37,99,235,0.15),transparent_35%)]" />
        <div className="relative max-w-lg">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300">Operational security</p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-tight">Visibility for the systems that keep operations moving.</h2>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-400">ThreatWatch OT brings your operational technology security workflow into one focused platform.</p>
        </div>
      </aside>
    </main>
  );
}

export default AuthLayout;
