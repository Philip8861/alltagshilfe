/**
 * Einzeilige JSON-Logs für Vercel/Server (keine Secrets).
 * UUID nur gekürzt (Suffix) zur Korrelation, nie den Service-Role-Key loggen.
 */
const SCOPE = "partner_sync_profile";

export type PartnerSyncLogEvent =
  | "sync_start"
  | "sync_auth"
  | "sync_user_select"
  | "sync_service_client"
  | "sync_svc_preselect"
  | "sync_upsert"
  | "sync_service_verify"
  | "sync_user_readable"
  | "sync_done";

export type PartnerSyncLogPayload = {
  event: PartnerSyncLogEvent;
  /** Letzte 8 Zeichen der User-UUID (auth.users.id / JWT sub), nur wenn bekannt */
  userIdSuffix?: string | null;
  authUserReadOk?: boolean;
  authErrorMessage?: string | null;
  /** Session-Client: SELECT partner_profiles für diese id */
  userSelectHasRow?: boolean;
  userSelectErrorMessage?: string | null;
  /** Env: SUPABASE_SERVICE_ROLE_KEY gesetzt (nur boolean) */
  serviceRoleKeyPresent?: boolean;
  /** Admin-Client: Upsert-Ergebnis */
  upsertErrorCode?: string | null;
  upsertErrorMessage?: string | null;
  upsertErrorDetails?: string | null;
  upsertErrorHint?: string | null;
  serviceVerifyHasRow?: boolean;
  serviceVerifyErrorMessage?: string | null;
  upsertSkippedRowExists?: boolean;
  userReadableOk?: boolean;
  resultOk?: boolean;
  created?: boolean;
  /** Nach Env-Änderung auf Vercel */
  vercelRedeployHint?: boolean;
};

function userIdSuffix(id: string | undefined): string | null {
  if (!id || id.length < 8) return null;
  return id.slice(-8);
}

export function logPartnerSyncProfile(payload: PartnerSyncLogPayload): void {
  const line = {
    scope: SCOPE,
    t: new Date().toISOString(),
    ...payload,
  };
  try {
    console.info(JSON.stringify(line));
  } catch {
    console.info(`[${SCOPE}] log failed`);
  }
}

export { userIdSuffix };
