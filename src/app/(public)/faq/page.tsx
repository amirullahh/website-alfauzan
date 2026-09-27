import { dummyFaqs } from "@/lib/dummy-data";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FaqPage() {
  const faqs = dummyFaqs;

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Pertanyaan Umum (FAQ)
          </h1>
          <p className="mt-3 text-muted-foreground">
            Jawaban untuk pertanyaan yang sering diajukan seputar pondok
          </p>
          <Separator className="mx-auto mt-4 w-16 bg-primary" />
        </div>

        <Accordion className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.id} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-heading text-sm font-semibold text-foreground hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
