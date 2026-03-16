import { Container } from "@/components/layout/Container";
import { FaqAccordion } from "./FaqAccordion";

type FaqItem = { question: string; answer: string };

type FaqProps = {
  title: string;
  items: FaqItem[];
};

export function Faq({ title, items }: FaqProps) {
  return (
    <section className="bg-neutral-50 py-16 sm:py-24" aria-labelledby="faq-heading">
      <Container>
        <h2
          id="faq-heading"
          className="text-center text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl"
        >
          {title}
        </h2>
        <div className="mx-auto mt-12 max-w-2xl">
          <FaqAccordion items={items} />
        </div>
      </Container>
    </section>
  );
}
