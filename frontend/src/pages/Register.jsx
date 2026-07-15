import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import AuthLayout from "../layouts/AuthLayout";

function messageFrom(error) {
  return error.response?.data?.message ?? "Unable to create your account. Please try again.";
}

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update(field) {
    return (event) => setForm({ ...form, [field]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await register(form);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(messageFrom(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start with a secure, individual ThreatWatch OT workspace."
      footer={<>Already have an account? <Link className="font-medium text-cyan-300 hover:text-cyan-200" to="/login">Sign in</Link></>}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200" role="alert">{error}</p>}
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-200">First name
            <input autoComplete="given-name" className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" onChange={update("first_name")} required value={form.first_name} />
          </label>
          <label className="block text-sm font-medium text-slate-200">Last name
            <input autoComplete="family-name" className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" onChange={update("last_name")} required value={form.last_name} />
          </label>
        </div>
        <label className="block text-sm font-medium text-slate-200">Email
          <input autoComplete="email" className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" onChange={update("email")} required type="email" value={form.email} />
        </label>
        <label className="block text-sm font-medium text-slate-200">Password
          <input autoComplete="new-password" className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" minLength="8" onChange={update("password")} required type="password" value={form.password} />
          <span className="mt-2 block text-xs font-normal text-slate-500">Use at least 8 characters.</span>
        </label>
        <button className="w-full rounded-lg bg-cyan-400 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Register;
