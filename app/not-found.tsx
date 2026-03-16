import Link from "next/link";
import { Container } from "@/components/layout/Container";

export default function NotFound() {
  return (
    <main className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            404 – Seite nicht gefunden
          </h1>
          <p className="mt-4 text-neutral-600">
            Die angeforderte Seite existiert nicht oder wurde verschoben.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-neutral-900 px-6 py-3 font-medium text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
          >
            Zur Startseite
          </Link>
        </div>
      </Container>
    </main>
  );
}
