import { Container } from "@/components/layout/Container";

type TrustItem = { title: string; description: string };

type TrustProps = {
  title: string;
  items: TrustItem[];
};

export function Trust({ title, items }: TrustProps) {
  return (
    <section className="bg-neutral-50 py-16 sm:py-24" aria-labelledby="trust-heading">
      <Container>
        <h2
          id="trust-heading"
          className="text-center text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl"
        >
          {title}
        </h2>
        <ul className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.title}
              className="rounded-xl bg-white p-6 shadow-sm border border-[#0F4F68]/10"
            >
              <h3 className="text-lg font-semibold text-neutral-900">
                {item.title}
              </h3>
              <p className="mt-2 text-neutral-600">{item.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
