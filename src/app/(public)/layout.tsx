import { AnnouncementBar } from "@/components/public/announcement-bar";
import { FloatingContactActions } from "@/components/public/floating-contact-actions";
import { MobileApplyBar } from "@/components/public/mobile-apply-bar";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <SiteFooter />
      <FloatingContactActions />
      <MobileApplyBar />
    </>
  );
}
