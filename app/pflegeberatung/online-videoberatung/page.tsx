import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";
import { OnlineVideoberatungClient } from "@/components/pflegeberatung/OnlineVideoberatungClient";

export const metadata: Metadata = {
  title: "Online Videoberatung",
  description: `Online Videoberatung für die private Pflegeberatung – ${siteConfig.name}.`,
};

export default function OnlineVideoberatungPage() {
  return (
    <article className="py-16 sm:py-24">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">Online Videoberatung</h1>
        <p className="mt-4 max-w-3xl text-neutral-600">
          Hier können Sie eine persönliche 1:1-Videoberatung starten. Über einen automatisch erzeugten Einladungslink kommt die zweite Person direkt in den gleichen Gesprächsraum.
        </p>
        <Suspense fallback={<p className="mt-6 text-sm text-neutral-600">Videoberatung wird vorbereitet…</p>}>
          <OnlineVideoberatungClient />
        </Suspense>
      </Container>
    </article>
  );
}

