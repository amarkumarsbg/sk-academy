import { ButtonLink } from "@/components/ui/button-link";

type PageCtaProps = {
  title?: string;
  description?: string;
};

export function PageCta({
  title = "Ready to Join SK Academy?",
  description = "Admissions are open. Apply today or get in touch with our team.",
}: PageCtaProps) {
  return (
    <section className="border-t bg-primary py-10 text-primary-foreground sm:py-12">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">{description}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/admissions" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            Apply Now
          </ButtonLink>
          <ButtonLink
            href="/admissions#brochure"
            size="lg"
            variant="outline"
            className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
          >
            Download Brochure
          </ButtonLink>
          <ButtonLink
            href="/contact"
            size="lg"
            variant="outline"
            className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
          >
            Contact Admissions
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
