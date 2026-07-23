"""JWT-protected OT network topology endpoint."""

from flask import Blueprint

from app.api.auth.decorators import active_user_required
from app.utils.responses import success_response

network_bp = Blueprint("network", __name__)


NETWORK_NODES = [
    {
        "id": "edge-firewall",
        "label": "Perimeter Firewall",
        "type": "Firewall",
        "vendor": "Palo Alto Networks",
        "model": "PA-440",
        "ip": "10.10.0.1",
        "firmware": "11.1.4",
        "criticality": "Critical",
        "status": "Online",
        "openVulnerabilities": 0,
        "activeAlerts": 1,
    },
    {
        "id": "core-switch",
        "label": "OT Core Switch",
        "type": "Core Switch",
        "vendor": "Cisco",
        "model": "IE-3400",
        "ip": "10.10.0.10",
        "firmware": "17.12.3",
        "criticality": "Critical",
        "status": "Online",
        "openVulnerabilities": 1,
        "activeAlerts": 0,
    },
    {
        "id": "siemens-plc",
        "label": "Siemens PLC S7-1500",
        "type": "PLC",
        "vendor": "Siemens",
        "model": "CPU 1516-3 PN/DP",
        "ip": "10.10.1.12",
        "firmware": "2.9.1",
        "criticality": "Critical",
        "status": "Online",
        "openVulnerabilities": 2,
        "activeAlerts": 1,
    },
    {
        "id": "schneider-rtu",
        "label": "Schneider RTU",
        "type": "RTU",
        "vendor": "Schneider Electric",
        "model": "SCADAPack 350",
        "ip": "10.10.3.34",
        "firmware": "4.2.7",
        "criticality": "High",
        "status": "Offline",
        "openVulnerabilities": 1,
        "activeAlerts": 1,
    },
    {
        "id": "abb-hmi",
        "label": "ABB HMI Panel",
        "type": "HMI",
        "vendor": "ABB",
        "model": "Panel 600",
        "ip": "10.10.2.18",
        "firmware": "6.3.0",
        "criticality": "High",
        "status": "Online",
        "openVulnerabilities": 1,
        "activeAlerts": 1,
    },
    {
        "id": "honeywell-scada",
        "label": "Honeywell SCADA Server",
        "type": "SCADA",
        "vendor": "Honeywell",
        "model": "Experion PKS",
        "ip": "10.10.5.25",
        "firmware": "3.5.2",
        "criticality": "Critical",
        "status": "Maintenance",
        "openVulnerabilities": 1,
        "activeAlerts": 0,
    },
    {
        "id": "aveva-historian",
        "label": "AVEVA Historian",
        "type": "Historian",
        "vendor": "AVEVA",
        "model": "System Platform 2024",
        "ip": "10.10.5.32",
        "firmware": "12.1.0",
        "criticality": "Medium",
        "status": "Online",
        "openVulnerabilities": 0,
        "activeAlerts": 1,
    },
    {
        "id": "engineering-workstation",
        "label": "Engineering Workstation",
        "type": "Engineering Workstation",
        "vendor": "Dell",
        "model": "Precision 3680",
        "ip": "10.10.10.45",
        "firmware": "Windows 11 IoT",
        "criticality": "High",
        "status": "Online",
        "openVulnerabilities": 2,
        "activeAlerts": 1,
    },
    {
        "id": "kepware-opc",
        "label": "OPC UA Server",
        "type": "OPC Server",
        "vendor": "PTC",
        "model": "Kepware KEPServerEX",
        "ip": "10.10.5.40",
        "firmware": "6.16.0",
        "criticality": "High",
        "status": "Online",
        "openVulnerabilities": 1,
        "activeAlerts": 0,
    },
]


NETWORK_EDGES = [
    {"id": "edge-firewall-core-switch", "source": "edge-firewall", "target": "core-switch", "health": "Healthy", "label": "OT DMZ uplink"},
    {"id": "core-switch-siemens-plc", "source": "core-switch", "target": "siemens-plc", "health": "Healthy", "label": "Cell 1"},
    {"id": "core-switch-schneider-rtu", "source": "core-switch", "target": "schneider-rtu", "health": "Degraded", "label": "Remote pump station"},
    {"id": "core-switch-abb-hmi", "source": "core-switch", "target": "abb-hmi", "health": "Healthy", "label": "Operator network"},
    {"id": "core-switch-honeywell-scada", "source": "core-switch", "target": "honeywell-scada", "health": "Degraded", "label": "Control services"},
    {"id": "honeywell-scada-aveva-historian", "source": "honeywell-scada", "target": "aveva-historian", "health": "Healthy", "label": "Historian replication"},
    {"id": "honeywell-scada-kepware-opc", "source": "honeywell-scada", "target": "kepware-opc", "health": "Healthy", "label": "OPC UA"},
    {"id": "core-switch-engineering-workstation", "source": "core-switch", "target": "engineering-workstation", "health": "Healthy", "label": "Engineering VLAN"},
]


@network_bp.get("")
@active_user_required
def get_network_topology(_user):
    """Return the current OT network devices and their health-aware connections."""
    return success_response({"nodes": NETWORK_NODES, "edges": NETWORK_EDGES})
