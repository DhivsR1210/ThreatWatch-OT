import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { useAssets } from "../../hooks/useAssets";
import { assetService } from "../../services/assets";
import AssetDialog from "./AssetDialog";
import AssetFilters from "./AssetFilters";
import AssetSummaryCards from "./AssetSummaryCards";
import AssetTable from "./AssetTable";
import DeleteAssetDialog from "./DeleteAssetDialog";

function AssetWorkspace() {
  const { assets, error, isLoading, loadAssets, setError } = useAssets();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ search: "", criticality: "", status: "" });
  const [editingAsset, setEditingAsset] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingAsset, setDeletingAsset] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredAssets = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return assets.filter((asset) => {
      const matchesSearch = !search || [asset.asset_name, asset.asset_type, asset.vendor, asset.ip_address, asset.plant_location].some((value) => value?.toLowerCase().includes(search));
      return matchesSearch && (!filters.criticality || asset.criticality === filters.criticality) && (!filters.status || asset.operational_status === filters.status);
    });
  }, [assets, filters]);

  async function saveAsset(payload) {
    if (editingAsset) await assetService.update(editingAsset.id, payload);
    else await assetService.create(payload);
    setIsDialogOpen(false);
    setEditingAsset(null);
    await loadAssets();
  }

  async function deleteAsset() {
    setIsDeleting(true);
    setError("");
    try {
      await assetService.remove(deletingAsset.id);
      setDeletingAsset(null);
      await loadAssets();
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? "Unable to delete asset.");
    } finally {
      setIsDeleting(false);
    }
  }

  async function signOut() {
    await logout();
    navigate("/login");
  }

  return (
    <main className="liquid-shell text-slate-100">
      <header className="glass-header border-b px-4 sm:px-6 lg:px-8"><div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4"><div className="flex items-center gap-3"><span className="glass-action grid size-8 place-items-center rounded-xl bg-cyan-300 text-xs font-black text-slate-950">TW</span><div><p className="font-semibold tracking-tight">ThreatWatch OT</p><p className="text-xs text-slate-500">Asset intelligence</p></div></div><div className="flex items-center gap-3"><span className="hidden text-sm text-slate-400 sm:block">{user?.first_name} {user?.last_name}</span><button className="glass-subpanel rounded-xl border px-3 py-1.5 text-sm text-slate-300" onClick={signOut} type="button">Sign out</button></div></div></header>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="glass-panel flex flex-col justify-between gap-5 rounded-3xl border p-6 md:flex-row md:items-end"><div><p className="text-sm font-medium text-cyan-300">Operational technology inventory</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Asset security posture</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Monitor the systems supporting industrial operations and prioritize the assets that carry the greatest operational risk.</p></div><button className="glass-action inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-200" onClick={() => { setEditingAsset(null); setIsDialogOpen(true); }} type="button"><span className="text-lg leading-none">+</span>Add asset</button></div>
        <div className="mt-8"><AssetSummaryCards assets={assets} /></div>
        <section className="glass-panel mt-7 overflow-hidden rounded-3xl border"><div className="border-b border-white/10 p-4 sm:p-5"><div className="mb-4 flex items-center justify-between gap-4"><div><h2 className="font-semibold text-slate-100">Asset inventory</h2><p className="mt-1 text-sm text-slate-500">{filteredAssets.length} of {assets.length} assets displayed</p></div>{isLoading && <span className="text-sm text-cyan-300">Refreshing…</span>}</div><AssetFilters filters={filters} onChange={setFilters} /></div>{error ? <div className="m-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200"><p>{error}</p><button className="mt-3 font-medium text-rose-100 underline" onClick={loadAssets} type="button">Try again</button></div> : isLoading ? <div className="grid min-h-64 place-items-center text-sm text-slate-500">Loading OT asset inventory…</div> : <AssetTable assets={filteredAssets} onDelete={setDeletingAsset} onEdit={(asset) => { setEditingAsset(asset); setIsDialogOpen(true); }} />}</section>
      </div>
      {isDialogOpen && <AssetDialog asset={editingAsset} onClose={() => { setIsDialogOpen(false); setEditingAsset(null); }} onSave={saveAsset} />}
      {deletingAsset && <DeleteAssetDialog asset={deletingAsset} isDeleting={isDeleting} onCancel={() => setDeletingAsset(null)} onConfirm={deleteAsset} />}
    </main>
  );
}

export default AssetWorkspace;
