"""JWT-protected MITRE ATT&CK for ICS catalog endpoint."""

from flask import Blueprint, request

from app.api.auth.decorators import active_user_required
from app.models.alert import Alert
from app.utils.responses import error_response, success_response

mitre_bp = Blueprint("mitre", __name__)


MITRE_TECHNIQUES = [
    {
        "technique_id": "T0843",
        "name": "Program Download",
        "description": "Adversaries may perform a program download to transfer a user program to a controller, enabling configuration or logic changes in an industrial process.",
        "tactic": "Lateral Movement",
        "platforms": ["PLC", "PAC", "DCS Controller", "Safety Controller"],
        "detection_guidance": "Monitor controller alarms, automation protocol functions, and engineering logs for full downloads, online edits, or program appends outside approved maintenance windows.",
        "mitigation": "Require authenticated, authorized engineering access; verify signed program artifacts; and restrict management protocols to allowlisted workstations.",
    },
    {
        "technique_id": "T0855",
        "name": "Unauthorized Command Message",
        "description": "Adversaries may send control messages to instruct industrial devices to perform actions outside intended functionality or without expected process preconditions.",
        "tactic": "Impair Process Control",
        "platforms": ["PLC", "RTU", "HMI", "DCS Controller"],
        "detection_guidance": "Baseline control protocol commands and alert on unexpected writes, setpoint changes, or commands from unapproved master devices.",
        "mitigation": "Use authenticated industrial protocols where available, enforce command allowlists, and segment control networks from engineering and enterprise zones.",
    },
    {
        "technique_id": "T0842",
        "name": "Network Sniffing",
        "description": "Adversaries may capture network traffic to understand the industrial environment, harvest credentials, or observe process communications.",
        "tactic": "Discovery",
        "platforms": ["Workstation", "HMI", "Switch", "Data Historian", "PLC", "RTU"],
        "detection_guidance": "Monitor for packet capture tooling, promiscuous-mode interfaces, and anomalous traffic mirroring or ARP behavior on OT segments.",
        "mitigation": "Encrypt network traffic where feasible, limit privileged access, statically configure sensitive network paths, and segment critical traffic.",
    },
    {
        "technique_id": "T0839",
        "name": "Modify Program",
        "description": "Adversaries may modify controller or application program content to alter process behavior, evade safeguards, or disrupt operations.",
        "tactic": "Impair Process Control",
        "platforms": ["PLC", "DCS Controller", "Safety Controller"],
        "detection_guidance": "Compare controller logic, firmware, and project files against approved baselines and alert on checksum or version mismatches.",
        "mitigation": "Use change control, signed code, role-based engineering access, and independent verification of controller program integrity.",
    },
    {
        "technique_id": "T0822",
        "name": "External Remote Services",
        "description": "Adversaries may leverage externally accessible remote services, such as VPNs or remote access gateways, to access internal OT resources.",
        "tactic": "Initial Access",
        "platforms": ["Remote Access Gateway", "VPN Server", "Workstation"],
        "detection_guidance": "Review remote access authentication, session timing, geolocation, and device posture for anomalous connections to OT environments.",
        "mitigation": "Require MFA, restrict remote access through jump hosts, enforce device posture checks, and limit access to approved maintenance windows.",
    },
    {
        "technique_id": "T0886",
        "name": "Remote Services",
        "description": "Adversaries may use services such as RDP, SMB, or SSH to move between assets and network segments inside an industrial environment.",
        "tactic": "Lateral Movement",
        "platforms": ["Workstation", "Engineering Workstation", "SCADA Server"],
        "detection_guidance": "Monitor lateral authentication, remote service creation, and new remote sessions between IT, engineering, and control zones.",
        "mitigation": "Segment networks, use dedicated jump hosts, disable unnecessary remote services, and apply least-privilege access controls.",
    },
    {
        "technique_id": "T1110",
        "name": "Brute Force",
        "description": "Adversaries may attempt to gain access by systematically guessing passwords or credentials for operator, engineering, or application accounts.",
        "tactic": "Credential Access",
        "platforms": ["HMI", "SCADA Server", "Engineering Workstation"],
        "detection_guidance": "Detect spikes in failed authentication, repeated access attempts across accounts, and login attempts from unrecognized engineering subnets.",
        "mitigation": "Enforce MFA where supported, strong account lockout policies, unique passwords, and monitored privileged access workflows.",
    },
    {
        "technique_id": "T1005",
        "name": "Data from Local System",
        "description": "Adversaries may search local systems for process data, historian exports, configuration files, or other information useful for follow-on activity.",
        "tactic": "Collection",
        "platforms": ["Historian", "SCADA Server", "Engineering Workstation"],
        "detection_guidance": "Monitor bulk archive access, unusual historian exports, and collection tooling running on OT servers or operator workstations.",
        "mitigation": "Restrict data export privileges, encrypt sensitive archives, maintain audit trails, and isolate historian services from untrusted network segments.",
    },
]


def technique_payload(technique):
    """Attach current alert and asset context to a MITRE technique."""
    alerts = Alert.query.filter_by(mitreTechnique=technique["technique_id"]).order_by(Alert.timestamp.desc()).all()
    related_alerts = [
        {
            "id": alert.id,
            "title": alert.title,
            "severity": alert.severity,
            "status": alert.status,
            "asset": alert.asset,
        }
        for alert in alerts
    ]
    return {
        **technique,
        "related_alerts": related_alerts,
        "related_assets": sorted({alert.asset for alert in alerts}),
    }


@mitre_bp.get("")
@active_user_required
def list_techniques(_user):
    """List seeded MITRE techniques with optional ICS-relevant filters."""
    technique_id = request.args.get("technique_id", "").strip().lower()
    tactic = request.args.get("tactic", "").strip().lower()
    platform = request.args.get("platform", "").strip().lower()
    keyword = request.args.get("keyword", request.args.get("search", "")).strip().lower()

    filtered = []
    for technique in MITRE_TECHNIQUES:
        searchable = " ".join(
            [
                technique["technique_id"],
                technique["name"],
                technique["description"],
                technique["tactic"],
                *technique["platforms"],
                technique["detection_guidance"],
                technique["mitigation"],
            ]
        ).lower()
        if technique_id and technique_id not in technique["technique_id"].lower():
            continue
        if tactic and tactic not in technique["tactic"].lower():
            continue
        if platform and not any(platform in item.lower() for item in technique["platforms"]):
            continue
        if keyword and keyword not in searchable:
            continue
        filtered.append(technique_payload(technique))

    return success_response({"techniques": filtered, "total": len(filtered)})


@mitre_bp.get("/<string:technique_id>")
@active_user_required
def get_technique(_user, technique_id):
    """Return one technique together with current alert context."""
    technique = next(
        (item for item in MITRE_TECHNIQUES if item["technique_id"].lower() == technique_id.lower()), None
    )
    if technique is None:
        return error_response("MITRE technique not found.", 404)
    return success_response({"technique": technique_payload(technique)})
