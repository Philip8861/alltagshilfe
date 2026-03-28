export type PartnerRole = "partner" | "admin";

export type PartnerProfile = {
  id: string;
  display_name: string | null;
  organization_name: string | null;
  role: PartnerRole;
  created_at?: string;
};

export type PflegeboxOrderRow = {
  id: string;
  partner_id: string | null;
  external_reference: string | null;
  status: string;
  summary_json: Record<string, unknown> | null;
  created_at: string;
};
