"use client";

import { useCallback, useEffect, useState } from "react";
import { Mail, Phone } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-shell";
import { AdminPageLoading } from "@/components/admin/admin-loading";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchAdmissionInquiries,
  fetchContactMessages,
  updateAdmissionInquiry,
  updateContactMessage,
  type AdmissionInquiryRecord,
  type ContactMessageRecord,
  type InboxStatus,
} from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { formatDateTimeLong } from "@/lib/format-relative-time";
import { cn } from "@/lib/utils";

const statusStyles: Record<InboxStatus, string> = {
  new: "border-l-amber-500",
  read: "border-l-blue-500",
  resolved: "border-l-emerald-500",
};

function normalizeStatus(status: InboxStatus | undefined): InboxStatus {
  return status ?? "new";
}

function StatusSelect({
  value,
  onChange,
}: {
  value: InboxStatus | undefined;
  onChange: (status: InboxStatus) => void;
}) {
  const status = normalizeStatus(value);

  return (
    <Select value={status} onValueChange={(v) => onChange(normalizeStatus(v as InboxStatus | undefined))}>
      <SelectTrigger className="h-8 w-[7.5rem] shrink-0 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="new">New</SelectItem>
        <SelectItem value="read">Read</SelectItem>
        <SelectItem value="resolved">Resolved</SelectItem>
      </SelectContent>
    </Select>
  );
}

function ContactLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="truncate hover:text-primary hover:underline">
      {children}
    </a>
  );
}

function InboxItemCard({
  name,
  createdAt,
  status,
  onStatusChange,
  notes,
  onNotesChange,
  meta,
  body,
}: {
  name: string;
  createdAt: string;
  status: InboxStatus | undefined;
  onStatusChange: (status: InboxStatus) => void;
  notes?: string;
  onNotesChange: (notes: string) => void;
  meta: React.ReactNode;
  body?: React.ReactNode;
}) {
  const normalizedStatus = normalizeStatus(status);

  return (
    <Card className={cn("overflow-hidden border-l-4 shadow-sm", statusStyles[normalizedStatus])}>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-semibold leading-tight">{name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatDateTimeLong(new Date(createdAt))}
            </p>
          </div>
          <StatusSelect value={status} onChange={onStatusChange} />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {meta}
        </div>

        {body}

        <div className="flex items-center gap-2 border-t pt-3">
          <span className="shrink-0 text-xs font-medium text-muted-foreground">Note</span>
          <Input
            defaultValue={notes ?? ""}
            placeholder="Add an internal note…"
            className="h-8"
            onBlur={(e) => onNotesChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function InboxPageContent() {
  const [contactMessages, setContactMessages] = useState<ContactMessageRecord[]>([]);
  const [inquiries, setInquiries] = useState<AdmissionInquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [messages, inquiryRows] = await Promise.all([fetchContactMessages(), fetchAdmissionInquiries()]);
      setContactMessages(messages);
      setInquiries(inquiryRows);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load inbox");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const updateContact = async (id: string, data: { status: InboxStatus; notes?: string }) => {
    const updated = await updateContactMessage(id, data);
    setContactMessages((rows) => rows.map((row) => (row._id === id ? updated : row)));
  };

  const updateInquiry = async (id: string, data: { status: InboxStatus; notes?: string }) => {
    const updated = await updateAdmissionInquiry(id, data);
    setInquiries((rows) => rows.map((row) => (row._id === id ? updated : row)));
  };

  const contactNewCount = contactMessages.filter((m) => normalizeStatus(m.status) === "new").length;
  const inquiryNewCount = inquiries.filter((m) => normalizeStatus(m.status) === "new").length;

  return (
    <>
      <AdminHeader title="Inbox" subtitle="Contact messages and admission inquiries" />
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

        {loading ? (
          <AdminPageLoading label="Loading inbox..." />
        ) : (
          <Tabs defaultValue="contact">
            <TabsList>
              <TabsTrigger value="contact">Contact ({contactNewCount} new)</TabsTrigger>
              <TabsTrigger value="inquiries">Admissions ({inquiryNewCount} new)</TabsTrigger>
            </TabsList>

            <TabsContent value="contact" className="mt-4 space-y-3">
              {contactMessages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No contact messages yet.</p>
              ) : (
                contactMessages.map((message) => (
                  <InboxItemCard
                    key={message._id}
                    name={message.name}
                    createdAt={message.createdAt}
                    status={message.status}
                    notes={message.notes}
                    onStatusChange={(status) => void updateContact(message._id, { status })}
                    onNotesChange={(notes) =>
                      void updateContact(message._id, { status: normalizeStatus(message.status), notes })
                    }
                    meta={
                      <>
                        <span className="inline-flex min-w-0 items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          <ContactLink href={`mailto:${message.email}`}>{message.email}</ContactLink>
                        </span>
                        {message.phone && (
                          <span className="inline-flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 shrink-0" />
                            <ContactLink href={`tel:${message.phone}`}>{message.phone}</ContactLink>
                          </span>
                        )}
                      </>
                    }
                    body={
                      <p className="rounded-md bg-muted/50 px-3 py-2 text-sm leading-relaxed text-foreground">
                        {message.message}
                      </p>
                    }
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="inquiries" className="mt-4 space-y-3">
              {inquiries.length === 0 ? (
                <p className="text-sm text-muted-foreground">No admission inquiries yet.</p>
              ) : (
                inquiries.map((inquiry) => (
                  <InboxItemCard
                    key={inquiry._id}
                    name={inquiry.name}
                    createdAt={inquiry.createdAt}
                    status={inquiry.status}
                    notes={inquiry.notes}
                    onStatusChange={(status) => void updateInquiry(inquiry._id, { status })}
                    onNotesChange={(notes) =>
                      void updateInquiry(inquiry._id, { status: normalizeStatus(inquiry.status), notes })
                    }
                    meta={
                      <>
                        <span className="inline-flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          <ContactLink href={`tel:${inquiry.phone}`}>{inquiry.phone}</ContactLink>
                        </span>
                        <span className="inline-flex min-w-0 items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          <ContactLink href={`mailto:${inquiry.email}`}>{inquiry.email}</ContactLink>
                        </span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                          Grade {inquiry.grade}
                        </span>
                      </>
                    }
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
}
