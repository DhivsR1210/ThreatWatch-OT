function DeleteAssetDialog({ asset, onCancel, onConfirm, isDeleting }) {
  return (
    <div aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-slate-950/75 p-4 backdrop-blur-sm" role="dialog">
      <div className="glass-panel w-full max-w-md rounded-3xl border p-6">
        <h2 className="text-lg font-semibold text-slate-100">Delete asset?</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">This will permanently remove <span className="font-medium text-slate-200">{asset.asset_name}</span> from the OT asset inventory.</p>
        <div className="mt-7 flex justify-end gap-3"><button className="glass-subpanel rounded-xl border px-4 py-2 text-sm font-medium text-slate-300" onClick={onCancel} type="button">Cancel</button><button className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-950/25 hover:bg-rose-400 disabled:opacity-60" disabled={isDeleting} onClick={onConfirm} type="button">{isDeleting ? "Deleting…" : "Delete asset"}</button></div>
      </div>
    </div>
  );
}

export default DeleteAssetDialog;
