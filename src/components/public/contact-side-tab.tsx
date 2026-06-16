import Link from "next/link";

export function ContactSideTab() {
  return (
    <Link
      href="/contact"
      className="fixed inset-y-0 right-0 z-40 hidden w-10 items-center justify-center rounded-l-lg bg-accent text-sm font-semibold text-accent-foreground shadow-lg transition hover:brightness-110 lg:flex"
      style={{ writingMode: "vertical-rl" }}
    >
      Contact Us
    </Link>
  );
}
