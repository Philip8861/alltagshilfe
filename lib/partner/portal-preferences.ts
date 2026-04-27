import type { PartnerTipAdminStatus } from "@/lib/partner/types";
import { formatProvisionEur } from "@/lib/partner/partner-tip-payout";
import { provisionBucketForServiceSlug } from "@/lib/partner/partner-tip-provision-bucket";
import { tipTableFields } from "@/lib/partner/partner-tip-table-fields";
import { PARTNER_TIP_STATUS_PARTNER_LABELS } from "@/lib/partner/partner-tip-admin";
import {
  PARTNER_RESPONSIBILITY_LABELS,
  type PartnerResponsibilitySlug,
} from "@/lib/partner/responsibility-areas";
import type { PartnerDashboardTipSerial } from "@/lib/partner/types";
import { serviceBadgeClass, serviceTipTableTypCellClass } from "@/lib/partner/service-slug-styles";

/** Sichtbare Spalten in den Statuslisten-Tabellen. */
export type PartnerPortalTableColumns = {
  vorname: boolean;
  nachname: boolean;
  firma: boolean;
  datum: boolean;
  status: boolean;
  betrag: boolean;
  notiz: boolean;
  archivButton: boolean;
  typ: boolean;
};

export type PartnerPortalPreferences = {
  showListMonatlich: boolean;
  showListEinmal: boolean;
  /** „Mein Archiv“-Bereich auf der Übersichtsseite */
  showArchivOnDashboard: boolean;
  columns: PartnerPortalTableColumns;
};

export const DEFAULT_PORTAL_TABLE_COLUMNS: PartnerPortalTableColumns = {
  vorname: true,
  nachname: true,
  firma: true,
  datum: true,
  status: true,
  betrag: true,
  notiz: true,
  archivButton: true,
  typ: true,
};

export const DEFAULT_PORTAL_PREFERENCES: PartnerPortalPreferences = {
  showListMonatlich: true,
  showListEinmal: true,
  showArchivOnDashboard: true,
  columns: { ...DEFAULT_PORTAL_TABLE_COLUMNS },
};

function statusPill(admin: PartnerTipAdminStatus): { label: string; className: string } {
  const label = PARTNER_TIP_STATUS_PARTNER_LABELS[admin] ?? String(admin);
  switch (admin) {
    case "in_bearbeitung":
      return { label, className: "bg-amber-400 text-amber-950" };
    case "termin_vereinbart":
      return { label, className: "bg-indigo-600 text-white" };
    case "warten_auf_rueckmeldung":
      return { label, className: "bg-violet-600 text-white" };
    case "bezahlt":
      return {
        label,
        className:
          "border border-green-600 bg-green-50 text-green-900 shadow-sm ring-1 ring-green-600/20",
      };
    case "erledigt":
      return { label, className: "bg-emerald-600 text-white" };
    case "abgelehnt":
      return { label, className: "bg-red-600 text-white" };
    default:
      return { label, className: "bg-neutral-500 text-white" };
  }
}

export type StatuslisteVariant = "monatlich" | "einmal" | "archiv";

export type PartnerStatuslisteRow = {
  id: string;
  tipId: string;
  isArchived: boolean;
  typ: string;
  typeClass: string;
  typCellClass: string;
  vorname: string;
  nachname: string;
  firma: string;
  datum: string;
  pill: { label: string; className: string };
  adminNote: string;
  betrag: string;
};

export function mapTipsToStatuslisteRows(tips: PartnerDashboardTipSerial[]): PartnerStatuslisteRow[] {
  return tips.map((t) => {
    const slug = t.service_slug as PartnerResponsibilitySlug;
    const typ = PARTNER_RESPONSIBILITY_LABELS[slug] ?? t.service_slug.replace(/_/g, " ");
    const f = tipTableFields(t.payload, t.service_slug);
    const datum = new Date(t.created_at).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const pill = statusPill(t.admin_status);
    const adminNote = t.admin_visible_note?.trim() ?? "";
    const paid = t.paid_amount_eur;
    const monatlichBucket = provisionBucketForServiceSlug(t.service_slug) === "monatlich";
    const showPaidMonatlich =
      monatlichBucket &&
      (t.admin_status === "erledigt" || t.admin_status === "bezahlt") &&
      paid != null &&
      Number.isFinite(Number(paid));
    const showPaidEinmal =
      !monatlichBucket && t.admin_status === "bezahlt" && paid != null && Number.isFinite(Number(paid));
    const betrag = showPaidMonatlich || showPaidEinmal ? formatProvisionEur(Number(paid)) : "—";
    return {
      id: t.id,
      tipId: t.id,
      isArchived: Boolean(t.partner_archived_at),
      typ,
      typeClass: serviceBadgeClass(t.service_slug),
      typCellClass: serviceTipTableTypCellClass(t.service_slug),
      vorname: f.vorname,
      nachname: f.nachname,
      firma: f.firma,
      datum,
      pill,
      adminNote,
      betrag,
    };
  });
}

function asBool(v: unknown, fallback: boolean): boolean {
  if (typeof v === "boolean") return v;
  return fallback;
}

export function parsePortalPreferences(raw: unknown): PartnerPortalPreferences {
  const base = { ...DEFAULT_PORTAL_PREFERENCES, columns: { ...DEFAULT_PORTAL_TABLE_COLUMNS } };
  if (raw == null || typeof raw !== "object" || Array.isArray(raw)) return base;
  const o = raw as Record<string, unknown>;
  const cols = o.columns;
  let columns = { ...DEFAULT_PORTAL_TABLE_COLUMNS };
  if (cols != null && typeof cols === "object" && !Array.isArray(cols)) {
    const c = cols as Record<string, unknown>;
    columns = {
      vorname: asBool(c.vorname, true),
      nachname: asBool(c.nachname, true),
      firma: asBool(c.firma, true),
      datum: asBool(c.datum, true),
      status: asBool(c.status, true),
      betrag: asBool(c.betrag, true),
      notiz: asBool(c.notiz, true),
      archivButton: asBool(c.archivButton, true),
      typ: asBool(c.typ, true),
    };
  }
  return {
    showListMonatlich: asBool(o.showListMonatlich, true),
    showListEinmal: asBool(o.showListEinmal, true),
    showArchivOnDashboard: asBool(o.showArchivOnDashboard, true),
    columns,
  };
}

/** Mindestens eine Tabellenspalte sichtbar; sonst Spalten-Defaults. (Listen dürfen alle ausgeblendet sein.) */
export function normalizePortalPreferences(p: PartnerPortalPreferences): PartnerPortalPreferences {
  const cols = p.columns;
  const anyCol = Object.values(cols).some(Boolean);
  if (!anyCol) {
    return { ...p, columns: { ...DEFAULT_PORTAL_TABLE_COLUMNS } };
  }
  return p;
}
