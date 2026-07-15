import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import AuthLayout from "../layouts/AuthLayout";

function messageFrom(error) {
  return error.response?.data?.message ?? "Unable to sign in. Please try again.";
}

function Login() {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const destination = location.state?.from?.pathname ?? "/dashboard";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(form);
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(messageFrom(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your ThreatWatch OT workspace."
      footer={<>New to ThreatWatch OT? <Link className="font-medium text-cyan-300 hover:text-cyan-200" to="/register">Create an account</Link></>}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200" role="alert">{error}</p>}
        <label className="block text-sm font-medium text-slate-200">Email
          <input autoComplete="email" className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" onChange={(event) => setForm({ ...form, email: event.target.value })} required type="email" value={form.email} />
        </label>
        <label className="block text-sm font-medium text-slate-200">Password
          <input autoComplete="current-password" className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" minLength="8" onChange={(event) => setForm({ ...form, password: event.target.value })} required type="password" value={form.password} />
        </label>
        <button className="w-full rounded-lg bg-cyan-400 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Login;
