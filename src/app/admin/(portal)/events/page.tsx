"use client";

import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-shell";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { useSiteContent } from "@/context/site-content-provider";
import { ExternalLink, Pencil } from "lucide-react";

export default function AdminEventsPage() {
  const { content } = useSiteContent();

  return (
    <>
      <AdminHeader title="Events" />
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap justify-end gap-2">
          <ButtonLink href="/admin/cms/events" size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            Edit on CMS
          </ButtonLink>
          <ButtonLink href="/events" size="sm" variant="outline" target="_blank">
            <ExternalLink className="mr-2 h-4 w-4" />
            Preview
          </ButtonLink>
        </div>
        <AdminDataTable
          columns={[
            { key: "title", label: "Event" },
            { key: "date", label: "Date" },
            { key: "time", label: "Time" },
            { key: "location", label: "Location" },
            {
              key: "type",
              label: "Type",
              render: (row) => <Badge variant="outline">{row.type as string}</Badge>,
            },
          ]}
          data={content.events}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Use the <Link href="/admin/cms/events" className="text-primary underline">Events CMS</Link> to add, edit, or remove events.
        </p>
      </div>
    </>
  );
}
