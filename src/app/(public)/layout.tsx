import { AnnouncementBar } from "@/components/public/announcement-bar";
import { FloatingContactActions } from "@/components/public/floating-contact-actions";
import { MobileApplyBar } from "@/components/public/mobile-apply-bar";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { OrganizationJsonLd } from "@/components/public/organization-json-ld";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OrganizationJsonLd />
      <AnnouncementBar />
      <SiteHeader />
      <main className="flex-1 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0">{children}</main>
      <SiteFooter />
      <FloatingContactActions />
      <MobileApplyBar />
    </>
  );
}
