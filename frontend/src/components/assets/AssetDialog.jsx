import { useEffect, useState } from "react";

const EMPTY_ASSET = { asset_name: "", asset_type: "", vendor: "", model: "", firmware_version: "", ip_address: "", mac_address: "", plant_location: "", criticality: "Medium", operational_status: "Online", risk_score: 0, last_seen: "" };

function asLocalDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function AssetDialog({ asset, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_ASSET);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm(asset ? { ...EMPTY_ASSET, ...asset, last_seen: asLocalDateTime(asset.last_seen) } : EMPTY_ASSET);
  }, [asset]);

  function update(field) {
    return (event) => setForm({ ...form, [field]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setIsSaving(true);
    try {
      await onSave({ ...form, risk_score: Number(form.risk_score), last_seen: form.last_seen ? new Date(form.last_seen).toISOString() : null });
    } catch (requestError) {
      const details = requestError.response?.data?.errors;
      setError(details ? Object.values(details)[0] : requestError.response?.data?.message ?? "Unable to save asset.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div aria-modal="true" className="fixed inset-0 z-50 flex items-end bg-slate-950/75 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6" role="dialog">
      <form className="glass-panel max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border p-6 sm:rounded-3xl" onSubmit={submit}>
        <div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-semibold text-slate-100">{asset ? "Edit asset" : "Add asset"}</h2><p className="mt-1 text-sm text-slate-400">Maintain a precise operational technology inventory.</p></div><button aria-label="Close dialog" className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-white" onClick={onClose} type="button">✕</button></div>
        {error && <p className="mt-5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200" role="alert">{error}</p>}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Asset name" required value={form.asset_name} onChange={update("asset_name")} />
          <Field label="Asset type" required value={form.asset_type} onChange={update("asset_type")} placeholder="PLC, HMI, gateway…" />
          <Field label="Vendor" value={form.vendor} onChange={update("vendor")} />
          <Field label="Model" value={form.model} onChange={update("model")} />
          <Field label="Firmware version" value={form.firmware_version} onChange={update("firmware_version")} />
          <Field label="Plant location" value={form.plant_location} onChange={update("plant_location")} />
          <Field label="IP address" value={form.ip_address} onChange={update("ip_address")} placeholder="192.168.10.24" />
          <Field label="MAC address" value={form.mac_address} onChange={update("mac_address")} placeholder="AA:BB:CC:DD:EE:FF" />
          <Select label="Criticality" value={form.criticality} onChange={update("criticality")} options={["Low", "Medium", "High", "Critical"]} />
          <Select label="Operational status" value={form.operational_status} onChange={update("operational_status")} options={["Online", "Offline", "Maintenance"]} />
          <Field label="Risk score" min="0" max="100" type="number" value={form.risk_score} onChange={update("risk_score")} />
          <Field label="Last seen" type="datetime-local" value={form.last_seen} onChange={update("last_seen")} />
        </div>
        <div className="mt-7 flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end"><button className="glass-subpanel rounded-xl border px-4 py-2.5 text-sm font-medium text-slate-300" onClick={onClose} type="button">Cancel</button><button className="glass-action rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-200 disabled:opacity-60" disabled={isSaving} type="submit">{isSaving ? "Saving…" : asset ? "Save changes" : "Add asset"}</button></div>
      </form>
    </div>
  );
}

function Field({ label, ...props }) {
  return <label className="block text-sm font-medium text-slate-300">{label}<input className="glass-control mt-2 w-full rounded-xl border px-3 py-2 text-sm text-slate-100 outline-none" {...props} /></label>;
}

function Select({ label, onChange, options, value }) {
  return <label className="block text-sm font-medium text-slate-300">{label}<select className="glass-control mt-2 w-full rounded-xl border px-3 py-2 text-sm text-slate-100 outline-none" onChange={onChange} value={value}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

export default AssetDialog;
