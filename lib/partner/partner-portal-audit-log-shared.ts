export type PartnerPortalAuditActorKind = "partner" | "admin" | "system";

export type PartnerPortalAuditEventKind =
  | "tip_submitted"
  | "tip_status_changed"
  | "tip_partner_archived"
  | "tip_partner_unarchived"
  | "tip_admin_archived"
  | "tip_admin_unarchived"
  | "tip_deleted"
  | "commission_rates_updated"
  | "tip_provision_adjusted"
  | "partner_created";

export type PartnerPortalAuditLogRow = {
  id: string;
  created_at: string;
  event_kind: PartnerPortalAuditEventKind | string;
  subject_partner_id: string | null;
  actor_kind: PartnerPortalAuditActorKind;
  actor_partner_id: string | null;
  actor_label: string | null;
  tip_id: string | null;
  summary: string;
  detail_json: Record<string, unknown> | null;
};

export const PARTNER_PORTAL_AUDIT_EVENT_LABELS: Record<PartnerPortalAuditEventKind, string> = {
  tip_submitted: "Neuer Tipp",
  tip_status_changed: "Status geändert",
  tip_partner_archived: "Partner-Archiv",
  tip_partner_unarchived: "Aus Partner-Archiv",
  tip_admin_archived: "Admin-Archiv",
  tip_admin_unarchived: "Aus Admin-Archiv",
  tip_deleted: "Tipp gelöscht",
  commission_rates_updated: "Provisionssätze",
  tip_provision_adjusted: "Provision angepasst",
  partner_created: "Partner angelegt",
};

export const PARTNER_PORTAL_AUDIT_ADMIN_LABEL = "System-Administration";
