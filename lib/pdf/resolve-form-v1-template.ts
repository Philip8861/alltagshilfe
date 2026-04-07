import path from "node:path";

/** Standard: `private/forms/form-v1-blank.pdf` (relativ zum Projektroot). */
export function resolveFormV1TemplatePath(): string {
  const env = process.env.FORM_V1_PDF_TEMPLATE_PATH?.trim();
  if (env) {
    return path.isAbsolute(env) ? env : path.join(process.cwd(), env);
  }
  return path.join(process.cwd(), "private", "forms", "form-v1-blank.pdf");
}
