import { Container } from "@/components/layout/Container";

type Referenz = { quote: string; author: string };

type ReferenzenProps = {
  title: string;
  subtitle: string;
  items: Referenz[];
};

export function Referenzen({ title, subtitle, items }: ReferenzenProps) {
  return (
    <section className="py-16 sm:py-24" aria-labelledby="referenzen-heading">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="referenzen-heading"
            className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl"
          >
            {title}
          </h2>
          <p className="mt-3 text-neutral-600">{subtitle}</p>
        </div>
        <ul className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <li
              key={i}
              className="rounded-xl border border-[#0F4F68]/15 bg-white p-6"
            >
              <blockquote className="text-neutral-700">
                <p>&bdquo;{item.quote}&ldquo;</p>
                <cite className="mt-3 block text-sm font-medium not-italic text-neutral-900">
                  — {item.author}
                </cite>
              </blockquote>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
