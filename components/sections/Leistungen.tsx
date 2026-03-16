import Link from "next/link";
import { Container } from "@/components/layout/Container";

type Leistung = {
  slug: string;
  title: string;
  description: string;
};

type LeistungenProps = {
  title: string;
  subtitle: string;
  items: Leistung[];
};

export function Leistungen({ title, subtitle, items }: LeistungenProps) {
  return (
    <section className="py-16 sm:py-24" aria-labelledby="leistungen-heading">
      <Container className="flex flex-col items-center">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="leistungen-heading"
            className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl"
          >
            {title}
          </h2>
          <p className="mt-3 text-neutral-600">{subtitle}</p>
        </div>
        <ul className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-items-center w-full">
          {items.map((item) => (
            <li key={item.slug} className="w-full max-w-sm">
              <Link
                href={`/leistungen/${item.slug}`}
                className="block rounded-xl border border-[#0F4F68]/15 bg-white p-6 shadow-sm transition-shadow hover:shadow-md focus:outline-none focus:ring-1 focus:ring-[#0F4F68] focus:ring-offset-2 text-center"
              >
                <h3 className="text-lg font-semibold text-neutral-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-600">
                  {item.description}
                </p>
                <span className="mt-3 inline-block text-sm font-medium text-neutral-900">
                  Mehr erfahren →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
