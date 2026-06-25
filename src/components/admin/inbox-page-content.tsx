"use client";

import { useCallback, useEffect, useState } from "react";
import { Mail, Phone } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-shell";
import { AdminLoadingText, AdminPageLoading } from "@/components/admin/admin-loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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

const statusColors: Record<InboxStatus, string> = {
  new: "bg-amber-500 text-white",
  read: "bg-blue-600 text-white",
  resolved: "bg-emerald-600 text-white",
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
      <SelectTrigger className="w-[140px]">
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
              <TabsTrigger value="contact">
                Contact ({contactMessages.filter((m) => normalizeStatus(m.status) === "new").length} new)
              </TabsTrigger>
              <TabsTrigger value="inquiries">
                Admissions ({inquiries.filter((m) => normalizeStatus(m.status) === "new").length} new)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contact" className="mt-4 space-y-4">
              {contactMessages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No contact messages yet.</p>
              ) : (
                contactMessages.map((message) => (
                  <Card key={message._id}>
                    <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                      <div>
                        <CardTitle className="text-base">{message.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{formatDateTimeLong(new Date(message.createdAt))}</p>
                      </div>
                      <Badge className={statusColors[normalizeStatus(message.status)]}>{normalizeStatus(message.status)}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <a href={`mailto:${message.email}`} className="hover:text-primary">
                            {message.email}
                          </a>
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{message.message}</p>
                      <div className="flex flex-wrap items-end gap-3">
                        <div className="space-y-1">
                          <Label>Status</Label>
                          <StatusSelect
                            value={message.status}
                            onChange={(status) => void updateContact(message._id, { status })}
                          />
                        </div>
                        <div className="min-w-[220px] flex-1 space-y-1">
                          <Label>Notes</Label>
                          <Textarea
                            rows={2}
                            defaultValue={message.notes ?? ""}
                            onBlur={(e) => void updateContact(message._id, { status: normalizeStatus(message.status), notes: e.target.value })}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="inquiries" className="mt-4 space-y-4">
              {inquiries.length === 0 ? (
                <p className="text-sm text-muted-foreground">No admission inquiries yet.</p>
              ) : (
                inquiries.map((inquiry) => (
                  <Card key={inquiry._id}>
                    <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                      <div>
                        <CardTitle className="text-base">{inquiry.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{formatDateTimeLong(new Date(inquiry.createdAt))}</p>
                      </div>
                      <Badge className={statusColors[normalizeStatus(inquiry.status)]}>{normalizeStatus(inquiry.status)}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {inquiry.phone}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {inquiry.email}
                        </span>
                        <span>Grade: {inquiry.grade}</span>
                      </div>
                      <div className="flex flex-wrap items-end gap-3">
                        <div className="space-y-1">
                          <Label>Status</Label>
                          <StatusSelect
                            value={inquiry.status}
                            onChange={(status) => void updateInquiry(inquiry._id, { status })}
                          />
                        </div>
                        <div className="min-w-[220px] flex-1 space-y-1">
                          <Label>Notes</Label>
                          <Textarea
                            rows={2}
                            defaultValue={inquiry.notes ?? ""}
                            onBlur={(e) => void updateInquiry(inquiry._id, { status: normalizeStatus(inquiry.status), notes: e.target.value })}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
}
