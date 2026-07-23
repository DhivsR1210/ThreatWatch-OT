import { Database, MonitorCog, Network, RadioTower, Router, ServerCog, Shield, TerminalSquare, Workflow } from "lucide-react";
import { Handle, Position } from "reactflow";

const deviceIcons = {
  Firewall: Shield,
  "Core Switch": Network,
  PLC: Workflow,
  RTU: RadioTower,
  HMI: MonitorCog,
  SCADA: ServerCog,
  Historian: Database,
  "Engineering Workstation": TerminalSquare,
  "OPC Server": Router,
};

const criticalityClasses = {
  Critical: "border-rose-300/45 shadow-rose-950/30",
  High: "border-orange-300/35 shadow-orange-950/20",
  Medium: "border-amber-300/30 shadow-amber-950/20",
  Low: "border-cyan-300/30 shadow-cyan-950/20",
};

function TopologyNode({ data }) {
  const { device, onOpen } = data;
  const Icon = deviceIcons[device.type] || ServerCog;
  const statusClass = device.status === "Online" ? "bg-emerald-300" : device.status === "Maintenance" ? "bg-amber-300" : "bg-rose-300";

  return (
    <div aria-label={`Open details for ${device.label}`} className={`topology-node glass-panel min-w-48 rounded-2xl border p-3 shadow-lg ${criticalityClasses[device.criticality] || criticalityClasses.Low}`} onClick={() => onOpen(device)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onOpen(device); }} role="button" tabIndex="0">
      <Handle className="!h-2.5 !w-2.5 !border-2 !border-slate-950 !bg-cyan-300" position={Position.Left} type="target" />
      <div className="flex items-start gap-3">
        <span className="glass-subpanel grid h-9 w-9 shrink-0 place-items-center rounded-xl border text-cyan-100"><Icon className="h-4 w-4" /></span>
        <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-100">{device.label}</p><p className="mt-0.5 text-xs text-slate-500">{device.type} · {device.ip}</p></div>
        <span aria-label={`${device.status} status`} className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${statusClass} ${device.status === "Online" ? "shadow-[0_0_12px_rgba(110,231,183,0.8)]" : ""}`} />
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 text-[11px] font-medium"><span className="text-slate-400">{device.criticality}</span><span className={device.openVulnerabilities > 0 ? "text-amber-200" : "text-emerald-200"}>{device.openVulnerabilities} vuln{device.openVulnerabilities === 1 ? "" : "s"}</span><span className={device.activeAlerts > 0 ? "text-rose-200" : "text-slate-500"}>{device.activeAlerts} alert{device.activeAlerts === 1 ? "" : "s"}</span></div>
      <Handle className="!h-2.5 !w-2.5 !border-2 !border-slate-950 !bg-cyan-300" position={Position.Right} type="source" />
    </div>
  );
}

export default TopologyNode;
