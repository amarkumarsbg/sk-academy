"use client";

import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-shell";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { useSiteContent } from "@/context/site-content-provider";
import { ExternalLink, Pencil } from "lucide-react";

export default function NoticesPage() {
  const { content } = useSiteContent();

  return (
    <>
      <AdminHeader title="Notices" />
      <div className="p-4 pb-8 sm:p-6">
        <div className="mb-4 flex flex-wrap justify-end gap-2">
          <ButtonLink href="/admin/cms/news" size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            Edit on CMS
          </ButtonLink>
          <ButtonLink href="/news" size="sm" variant="outline" target="_blank">
            <ExternalLink className="mr-2 h-4 w-4" />
            Preview
          </ButtonLink>
        </div>
        <AdminDataTable
          columns={[
            { key: "id", label: "ID" },
            { key: "title", label: "Title" },
            { key: "date", label: "Date" },
            { key: "audience", label: "Audience" },
            {
              key: "status",
              label: "Status",
              render: (row) => (
                <Badge variant={row.status === "Published" ? "default" : "secondary"}>
                  {row.status as string}
                </Badge>
              ),
            },
          ]}
          data={content.notices}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Use the <Link href="/admin/cms/news" className="text-primary underline">News & Notices CMS</Link> to manage notices. Only published notices appear on the public site.
        </p>
      </div>
    </>
  );
}
