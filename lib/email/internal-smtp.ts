import nodemailer from "nodemailer";

/** Pro Kanal eigene Zieladresse(n), kommagetrennt; sonst Fallback `NOTIFICATION_TO`. */
export type InternalNotificationKind = "contact" | "karriere" | "pflegebox";

const KIND_TO_ENV: Record<InternalNotificationKind, string> = {
  contact: "NOTIFICATION_TO_CONTACT",
  karriere: "NOTIFICATION_TO_KARRIERE",
  pflegebox: "NOTIFICATION_TO_PFLEGEBOX",
};

type SmtpConnectionConfig = {
  host: string;
  port: number;
  secure: boolean;
  auth: { user: string; pass: string };
  from: string;
};

function parseSmtpConnection(): SmtpConnectionConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  if (!host || !user || pass === undefined || pass === "") {
    return null;
  }
  const port = Number.parseInt(process.env.SMTP_PORT ?? "465", 10);
  if (!Number.isFinite(port) || port < 1 || port > 65535) {
    return null;
  }
  const secureFlag = process.env.SMTP_SECURE?.trim().toLowerCase();
  const secure =
    secureFlag === "true" || secureFlag === "1"
      ? true
      : secureFlag === "false" || secureFlag === "0"
        ? false
        : port === 465;

  const from =
    process.env.MAIL_FROM?.trim() ||
    `Website <${user}>`;

  return { host, port, secure, auth: { user, pass }, from };
}

export function parseNotificationEmailList(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** Empfänger für diesen Kanal: zuerst NOTIFICATION_TO_* , sonst NOTIFICATION_TO. */
export function resolveRecipientsForKind(kind: InternalNotificationKind): string[] {
  const specific = parseNotificationEmailList(process.env[KIND_TO_ENV[kind]]);
  if (specific.length > 0) return specific;
  return parseNotificationEmailList(process.env.NOTIFICATION_TO);
}

/** Nur SMTP-Verbindung (ohne NOTIFICATION_TO) – z. B. transaktionale Mails an Endnutzer. */
export function isTransactionalSmtpConfigured(): boolean {
  return parseSmtpConnection() !== null;
}

export function isInternalSmtpConfigured(): boolean {
  const conn = parseSmtpConnection();
  if (!conn) return false;
  const hasAnyRecipient =
    parseNotificationEmailList(process.env.NOTIFICATION_TO).length > 0 ||
    parseNotificationEmailList(process.env.NOTIFICATION_TO_CONTACT).length > 0 ||
    parseNotificationEmailList(process.env.NOTIFICATION_TO_KARRIERE).length > 0 ||
    parseNotificationEmailList(process.env.NOTIFICATION_TO_PFLEGEBOX).length > 0 ||
    parseNotificationEmailList(process.env.NOTIFICATION_TO_CONTACT_TOPIC_KARRIERE).length > 0 ||
    parseNotificationEmailList(process.env.NOTIFICATION_TO_BETRIEBLICH_ANGEBOT).length > 0;
  return hasAnyRecipient;
}

export type SendInternalMailAttachment = {
  filename: string;
  content: Buffer;
  contentType?: string;
};

export type SendInternalMailInput = {
  kind: InternalNotificationKind;
  /** Wenn gesetzt (nicht leer), überschreibt die Empfängerliste für diesen Versand. */
  toOverride?: string[];
  subject: string;
  /** Klartext-Fallback (Barrierefreiheit, ältere Clients). */
  text: string;
  /** Gestaltetes HTML (Markenlayout); optional, sonst nur text. */
  html?: string;
  replyTo?: string;
  attachments?: SendInternalMailAttachment[];
};

/**
 * Versand per SMTP (z. B. ALL-INKL: *.kasserver.com, Port 465 SSL oder 587 STARTTLS).
 * Empfänger pro Kanal via NOTIFICATION_TO_CONTACT / _KARRIERE / _PFLEGEBOX, Fallback NOTIFICATION_TO.
 */
const SIMPLE_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Transaktionaler Versand an eine einzelne Adresse (z. B. Partner-Passwort-Reset).
 * Nutzt dieselbe SMTP-Konfiguration wie interne Benachrichtigungen.
 */
export async function sendTransactionalMail(input: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<{ ok: true } | { ok: false; code: "smtp_not_configured" | "invalid_recipient" | "send_failed" }> {
  const conn = parseSmtpConnection();
  const to = input.to.trim();
  if (!conn) {
    console.warn("[transactional-mail] SMTP unvollständig (SMTP_HOST, SMTP_USER, SMTP_PASS).");
    return { ok: false, code: "smtp_not_configured" };
  }
  if (!to || !SIMPLE_EMAIL_RE.test(to)) {
    return { ok: false, code: "invalid_recipient" };
  }

  const subject = input.subject.length > 998 ? `${input.subject.slice(0, 995)}…` : input.subject;

  try {
    const transporter = nodemailer.createTransport({
      host: conn.host,
      port: conn.port,
      secure: conn.secure,
      auth: conn.auth,
      connectionTimeout: 20_000,
      greetingTimeout: 20_000,
      socketTimeout: 25_000,
      ...(conn.port === 587 && !conn.secure ? { requireTLS: true } : {}),
    });

    await transporter.sendMail({
      from: conn.from,
      to,
      subject,
      text: input.text,
      ...(input.html ? { html: input.html } : {}),
    });
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    console.error("[transactional-mail] Versand fehlgeschlagen:", msg);
    return { ok: false, code: "send_failed" };
  }
}

export async function sendInternalMail(
  input: SendInternalMailInput,
): Promise<{ ok: true } | { ok: false; code: "smtp_not_configured" | "send_failed" }> {
  const conn = parseSmtpConnection();
  /**
   * toOverride: nur setzen, wenn die Aufrufer:in die Liste explizit kennt (z. B. Kontakt + Thema).
   * Leeres Array nicht als „fehlt“ behandeln — sonst würde fälschlich auf den Kanal-Fallback
   * umgeschaltet und z. B. Karriere-Routing übersprungen.
   */
  const to =
    input.toOverride !== undefined
      ? input.toOverride
      : resolveRecipientsForKind(input.kind);
  if (!conn || to.length === 0) {
    if (!conn) {
      console.warn(
        "[internal-mail] SMTP unvollständig: SMTP_HOST, SMTP_USER und SMTP_PASS müssen in Production gesetzt sein.",
      );
    } else {
      console.warn(
        `[internal-mail] Kein Empfänger für "${input.kind}": NOTIFICATION_TO_CONTACT / _KARRIERE / _PFLEGEBOX oder NOTIFICATION_TO setzen.`,
      );
    }
    return { ok: false, code: "smtp_not_configured" };
  }

  const subject = input.subject.length > 998 ? `${input.subject.slice(0, 995)}…` : input.subject;
  const replyTo = input.replyTo?.trim();

  try {
    const transporter = nodemailer.createTransport({
      host: conn.host,
      port: conn.port,
      secure: conn.secure,
      auth: conn.auth,
      connectionTimeout: 20_000,
      greetingTimeout: 20_000,
      socketTimeout: 25_000,
      ...(conn.port === 587 && !conn.secure ? { requireTLS: true } : {}),
    });

    await transporter.sendMail({
      from: conn.from,
      to: to.join(", "),
      ...(replyTo ? { replyTo } : {}),
      subject,
      text: input.text,
      ...(input.html ? { html: input.html } : {}),
      ...(input.attachments && input.attachments.length > 0
        ? {
            attachments: input.attachments.map((a) => ({
              filename: a.filename,
              content: a.content,
              ...(a.contentType ? { contentType: a.contentType } : {}),
            })),
          }
        : {}),
    });
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    console.error(`[internal-mail] Versand fehlgeschlagen (kind=${input.kind}):`, msg);
    return { ok: false, code: "send_failed" };
  }
}
