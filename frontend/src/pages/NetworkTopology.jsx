import { useMemo, useState } from "react";
import { Activity, RefreshCw, Search } from "lucide-react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";

import DeviceDrawer from "../components/network/DeviceDrawer";
import TopologyNode from "../components/network/TopologyNode";
import { useNetworkTopology } from "../hooks/useNetworkTopology";

const nodeTypes = { otDevice: TopologyNode };

const positions = {
  "edge-firewall": { x: 20, y: 255 },
  "core-switch": { x: 300, y: 255 },
  "siemens-plc": { x: 620, y: 70 },
  "schneider-rtu": { x: 620, y: 230 },
  "abb-hmi": { x: 620, y: 390 },
  "honeywell-scada": { x: 620, y: 550 },
  "aveva-historian": { x: 935, y: 490 },
  "kepware-opc": { x: 935, y: 650 },
  "engineering-workstation": { x: 300, y: 585 },
};

function NetworkTopology() {
  const { topology, isLoading, error, loadTopology } = useNetworkTopology();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [selectedDevice, setSelectedDevice] = useState(null);

  const deviceTypes = useMemo(() => [...new Set(topology.nodes.map((node) => node.type))].sort(), [topology.nodes]);
  const visibleDevices = useMemo(() => {
    const term = search.trim().toLowerCase();
    return topology.nodes.filter((device) => {
      const matchesSearch = !term || [device.label, device.type, device.vendor, device.ip].some((value) => value.toLowerCase().includes(term));
      return matchesSearch && (!type || device.type === type) && (!status || device.status === status);
    });
  }, [search, status, topology.nodes, type]);
  const visibleIds = useMemo(() => new Set(visibleDevices.map((device) => device.id)), [visibleDevices]);
  const flowNodes = useMemo(() => topology.nodes.map((device) => ({ id: device.id, type: "otDevice", position: positions[device.id] || { x: 0, y: 0 }, hidden: !visibleIds.has(device.id), data: { device, onOpen: setSelectedDevice } })), [topology.nodes, visibleIds]);
  const flowEdges = useMemo(() => topology.edges.map((edge) => {
    const healthy = edge.health === "Healthy";
    return { ...edge, hidden: !visibleIds.has(edge.source) || !visibleIds.has(edge.target), animated: !healthy, type: "smoothstep", labelStyle: { fill: healthy ? "#67e8f9" : "#fbbf24", fontSize: 11, fontWeight: 600 }, labelBgStyle: { fill: "#0f172a", fillOpacity: 0.78 }, labelBgPadding: [6, 3], labelBgBorderRadius: 6, style: { stroke: healthy ? "#22d3ee" : "#f59e0b", strokeWidth: healthy ? 1.7 : 2.2, opacity: healthy ? 0.72 : 0.95 } };
  }), [topology.edges, visibleIds]);

  const healthyConnections = topology.edges.filter((edge) => edge.health === "Healthy").length;
  const degradedConnections = topology.edges.length - healthyConnections;

  return (
    <div className="space-y-7">
      <section className="glass-panel rounded-3xl border p-7 sm:p-8"><div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">Network operations</p><h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">OT network topology</h1><p className="mt-3 text-sm leading-7 text-slate-400">Explore the live relationship between industrial devices, their health, and current security exposure.</p></div><button className="glass-subpanel inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold text-cyan-100" onClick={loadTopology} type="button"><RefreshCw className="h-4 w-4" />Refresh topology</button></div></section>
      <section className="grid gap-4 sm:grid-cols-3"><Stat label="OT devices" value={topology.nodes.length} tone="text-cyan-200" /><Stat label="Healthy links" value={healthyConnections} tone="text-emerald-200" /><Stat label="Degraded links" value={degradedConnections} tone="text-amber-200" /></section>
      <section className="glass-panel rounded-3xl border p-5 sm:p-6"><div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_12rem_11rem]"><label className="relative"><span className="sr-only">Search network devices</span><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input className="glass-control w-full rounded-2xl border py-3 pl-11 pr-4 text-sm text-slate-100 outline-none placeholder:text-slate-600" onChange={(event) => setSearch(event.target.value)} placeholder="Search device, vendor, type, or IP address" value={search} /></label><select aria-label="Filter devices by type" className="glass-control rounded-2xl border px-3 py-3 text-sm text-slate-200 outline-none" onChange={(event) => setType(event.target.value)} value={type}><option value="">All device types</option>{deviceTypes.map((deviceType) => <option key={deviceType} value={deviceType}>{deviceType}</option>)}</select><select aria-label="Filter devices by status" className="glass-control rounded-2xl border px-3 py-3 text-sm text-slate-200 outline-none" onChange={(event) => setStatus(event.target.value)} value={status}><option value="">All statuses</option><option value="Online">Online</option><option value="Maintenance">Maintenance</option><option value="Offline">Offline</option></select></div></section>
      {error && <div className="rounded-3xl border border-rose-400/25 bg-rose-400/10 p-4 text-sm text-rose-100">{error}</div>}
      {isLoading ? <div className="glass-panel rounded-3xl border p-10 text-center text-sm text-slate-400">Loading OT network topology…</div> : <section className="glass-panel topology-canvas overflow-hidden rounded-3xl border"><div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-white/10 px-5 py-4 text-xs font-medium text-slate-400"><span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]" />Healthy connection</span><span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.7)]" />Degraded connection</span><span className="ml-auto text-slate-500">{visibleDevices.length} visible devices</span></div><div className="h-[620px]"><ReactFlow edges={flowEdges} fitView fitViewOptions={{ padding: 0.2 }} maxZoom={1.6} minZoom={0.35} nodeTypes={nodeTypes} nodes={flowNodes} nodesConnectable={false} nodesDraggable={false} nodesFocusable panOnDrag proOptions={{ hideAttribution: true }}><Background color="rgba(103, 232, 249, 0.13)" gap={28} size={1} /><Controls className="!overflow-hidden !rounded-2xl !border !border-white/15 !bg-slate-950/75 !shadow-2xl [&>button]:!border-white/10 [&>button]:!bg-slate-900/70 [&>button]:!fill-slate-200 [&>button:hover]:!bg-slate-800" showInteractive={false} /><MiniMap className="!overflow-hidden !rounded-2xl !border !border-white/15 !bg-slate-950/80 !shadow-2xl" maskColor="rgba(2, 6, 23, 0.6)" nodeColor={(node) => node.data.device.status === "Online" ? "#22d3ee" : node.data.device.status === "Maintenance" ? "#f59e0b" : "#f43f5e"} pannable zoomable /></ReactFlow></div></section>}
      <DeviceDrawer device={selectedDevice} onClose={() => setSelectedDevice(null)} />
    </div>
  );
}

function Stat({ label, value, tone }) {
  return <article className="glass-panel rounded-3xl border p-5"><div className="flex items-center justify-between"><p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">{label}</p><span className={`glass-subpanel grid h-10 w-10 place-items-center rounded-2xl ${tone}`}><Activity className="h-4 w-4" /></span></div><p className="mt-5 text-3xl font-semibold text-white">{value}</p></article>;
}

export default NetworkTopology;
