import Link from "next/link";

export function ContactSideTab() {
  return (
    <Link
      href="/contact"
      aria-label="Contact Us"
      className="fixed right-0 top-1/2 z-40 hidden w-10 -translate-y-1/2 flex-col items-center justify-center rounded-l-lg bg-accent px-2 py-6 text-sm font-semibold text-accent-foreground shadow-lg transition hover:brightness-110 lg:flex"
    >
      <span className="inline-block [writing-mode:vertical-rl] [text-orientation:mixed] tracking-wide">
        Contact Us
      </span>
    </Link>
  );
}
