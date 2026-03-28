"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function PartnerLogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        setPending(true);
        void (async () => {
          try {
            const supabase = createSupabaseBrowserClient();
            await supabase.auth.signOut();
          } catch {
            /* Session ggf. schon ungültig */
          }
          router.refresh();
          router.push("/partner/login");
          setPending(false);
        })();
      }}
      className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#0F4F68]/25 px-4 py-2 text-sm font-semibold text-[#0F4F68] hover:bg-white disabled:opacity-60"
    >
      {pending ? "Abmelden…" : "Abmelden"}
    </button>
  );
}
