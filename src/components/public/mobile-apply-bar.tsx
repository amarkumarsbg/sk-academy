import { ButtonLink } from "@/components/ui/button-link";

export function MobileApplyBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white/95 p-3 shadow-lg backdrop-blur md:hidden">
      <ButtonLink href="/admissions" className="w-full">
        Apply Now
      </ButtonLink>
    </div>
  );
}
