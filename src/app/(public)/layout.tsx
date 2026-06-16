import { AnnouncementBar } from "@/components/public/announcement-bar";
import { ContactSideTab } from "@/components/public/contact-side-tab";
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
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <ContactSideTab />
    </>
  );
}
