import { getDemoAvatarColorPair, getDemoAvatarInitials } from "@/lib/partner/partner-demo-avatars";

type RouteParams = { params: Promise<{ code: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { code: rawCode } = await params;
  const code = decodeURIComponent(rawCode ?? "").trim().toUpperCase();
  if (!/^[A-Z0-9]{1,32}$/.test(code)) {
    return new Response("Ungültiger Code", { status: 400 });
  }

  const [from, to] = getDemoAvatarColorPair(code);
  const initials = getDemoAvatarInitials(code, null);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="${code}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="50" fill="url(#g)"/>
  <circle cx="50" cy="36" r="16" fill="white" opacity="0.92"/>
  <ellipse cx="50" cy="78" rx="26" ry="20" fill="white" opacity="0.92"/>
  <text x="50" y="41" text-anchor="middle" font-family="Nunito Sans, Arial, sans-serif" font-size="11" font-weight="700" fill="${from}">${initials}</text>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
