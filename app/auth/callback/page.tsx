import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCallbackClient } from "@/components/auth/AuthCallbackClient";

export const metadata: Metadata = {
  title: "Anmeldung",
  robots: { index: false, follow: false },
};

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-16 text-center text-sm text-neutral-600">
          Anmeldung wird geprüft…
        </div>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  );
}
