"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Calendar,
  ClipboardList,
  Globe,
  GraduationCap,
  Inbox,
  Users,
  type LucideIcon,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-shell";
import { AdminLoadingText, AdminStatLoading } from "@/components/admin/admin-loading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  fetchAdmissionInquiries,
  fetchContactMessages,
  type AdmissionInquiryRecord,
  type ContactMessageRecord,
} from "@/lib/api";
import { useResource } from "@/hooks/use-resource";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { formatTodayLong } from "@/lib/today";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  Users,
  Inbox,
  ClipboardList,
};

const quickActions = [
  { label: "Add Student", href: "/admin/students", icon: GraduationCap, iconClass: "text-blue-600", bgClass: "bg-blue-50 hover:bg-blue-100/80" },
  { label: "Inbox", href: "/admin/inbox", icon: Inbox, iconClass: "text-amber-600", bgClass: "bg-amber-50 hover:bg-amber-100/80" },
  { label: "Admissions", href: "/admin/admissions", icon: ClipboardList, iconClass: "text-emerald-600", bgClass: "bg-emerald-50 hover:bg-emerald-100/80" },
  { label: "CMS", href: "/admin/cms", icon: Globe, iconClass: "text-violet-600", bgClass: "bg-violet-50 hover:bg-violet-100/80" },
  { label: "Notices", href: "/admin/notices", icon: Bell, iconClass: "text-rose-600", bgClass: "bg-rose-50 hover:bg-rose-100/80" },
  { label: "Events", href: "/admin/events", icon: Calendar, iconClass: "text-sky-600", bgClass: "bg-sky-50 hover:bg-sky-100/80" },
] as const;

type InboxPreviewItem =
  | { kind: "contact"; id: string; name: string; detail: string; createdAt: string; status: string }
  | { kind: "inquiry"; id: string; name: string; detail: string; createdAt: string; status: string };

export default function AdminDashboardPage() {
  const todayLabel = formatTodayLong();

  const { items: students, loading: studentsLoading } = useResource<{ id: string; status: string }>("students");
  const { items: teachers, loading: teachersLoading } = useResource<{ id: string }>("teachers");
  const { items: admissions, loading: admissionsLoading } = useResource<{
    id: string;
    applicant: string;
    grade: string;
    status: string;
    date: string;
  }>("admissions");
  const { items: events, loading: eventsLoading } = useResource<{
    id: string;
    title: string;
    date: string;
    type: string;
  }>("events");

  const [inboxLoading, setInboxLoading] = useState(true);
  const [contactMessages, setContactMessages] = useState<ContactMessageRecord[]>([]);
  const [inquiries, setInquiries] = useState<AdmissionInquiryRecord[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadInbox() {
      setInboxLoading(true);
      try {
        const [messages, inquiryRows] = await Promise.all([
          fetchContactMessages(),
          fetchAdmissionInquiries(),
        ]);
        if (!cancelled) {
          setContactMessages(messages);
          setInquiries(inquiryRows);
        }
      } finally {
        if (!cancelled) setInboxLoading(false);
      }
    }

    void loadInbox();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeStudents = students.filter((s) => s.status === "Active").length;
  const pendingAdmissions = admissions.filter((a) => a.status === "Pending");
  const newInboxCount =
    contactMessages.filter((m) => (m.status ?? "new") === "new").length +
    inquiries.filter((m) => (m.status ?? "new") === "new").length;

  const upcomingEvents = useMemo(
    () =>
      [...events]
        .filter((event) => event.date >= new Date().toISOString().slice(0, 10))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 3),
    [events]
  );

  const recentInbox = useMemo<InboxPreviewItem[]>(() => {
    const items: InboxPreviewItem[] = [
      ...contactMessages.map((message) => ({
        kind: "contact" as const,
        id: message._id,
        name: message.name,
        detail: message.message,
        createdAt: message.createdAt,
        status: message.status ?? "new",
      })),
      ...inquiries.map((inquiry) => ({
        kind: "inquiry" as const,
        id: inquiry._id,
        name: inquiry.name,
        detail: `Grade ${inquiry.grade} · ${inquiry.phone}`,
        createdAt: inquiry.createdAt,
        status: inquiry.status ?? "new",
      })),
    ];

    return items
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);
  }, [contactMessages, inquiries]);

  const dashboardStats = [
    {
      label: "Students",
      loading: studentsLoading,
      value: String(students.length),
      change: `${activeStudents} active`,
      icon: "GraduationCap" as const,
      href: "/admin/students",
    },
    {
      label: "Teachers",
      loading: teachersLoading,
      value: String(teachers.length),
      change: "On staff",
      icon: "Users" as const,
      href: "/admin/teachers",
    },
    {
      label: "New Inbox",
      loading: inboxLoading,
      value: String(newInboxCount),
      change: newInboxCount === 0 ? "All caught up" : "Needs attention",
      icon: "Inbox" as const,
      href: "/admin/inbox",
    },
    {
      label: "Admissions",
      loading: admissionsLoading,
      value: String(pendingAdmissions.length),
      change: pendingAdmissions.length === 0 ? "None pending" : "Pending review",
      icon: "ClipboardList" as const,
      href: "/admin/admissions",
    },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" welcome subtitle={todayLabel} />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4 sm:p-5">
        <div className="grid shrink-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((stat) => {
            const Icon = iconMap[stat.icon];
            return (
              <Link key={stat.label} href={stat.href} className="block">
                <Card className="transition-colors hover:border-primary/30">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                      {stat.loading ? (
                        <AdminStatLoading />
                      ) : (
                        <p className="text-2xl font-bold leading-tight">{stat.value}</p>
                      )}
                      <p className="truncate text-xs text-muted-foreground">
                        {stat.loading ? "Loading..." : stat.change}
                      </p>
                    </div>
                    {Icon && <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <Card className="mt-3 shrink-0">
          <CardContent className="grid grid-cols-3 gap-2 p-3 sm:grid-cols-6">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-lg border px-2 py-2.5 text-center transition-colors",
                  action.bgClass
                )}
              >
                <action.icon className={cn("h-4 w-4", action.iconClass)} />
                <span className="text-[11px] font-medium leading-tight">{action.label}</span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <div className="mt-3 grid min-h-0 flex-1 gap-3 xl:grid-cols-3">
          <Card className="flex min-h-0 flex-col overflow-hidden xl:col-span-2">
            <CardHeader className="flex shrink-0 flex-row items-center justify-between space-y-0 px-4 py-3">
              <CardTitle className="text-sm">Recent Inbox</CardTitle>
              <Link href="/admin/inbox" className="text-xs font-medium text-primary hover:underline">
                View all
              </Link>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 overflow-hidden px-4 pb-4 pt-0">
              {inboxLoading ? (
                <AdminLoadingText label="Loading inbox..." />
              ) : recentInbox.length === 0 ? (
                <p className="text-sm text-muted-foreground">No messages yet.</p>
              ) : (
                <div className="divide-y">
                  {recentInbox.map((item) => (
                    <Link
                      key={`${item.kind}-${item.id}`}
                      href="/admin/inbox"
                      className="flex items-center justify-between gap-3 py-2.5 transition-colors hover:bg-muted/40 first:pt-0"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium">{item.name}</p>
                          {item.status === "new" && (
                            <Badge className="h-5 shrink-0 bg-amber-500 px-1.5 text-[10px] text-white hover:bg-amber-500">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{item.detail}</p>
                      </div>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {formatRelativeTime(new Date(item.createdAt))}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="flex min-h-0 flex-col overflow-hidden">
            <CardHeader className="shrink-0 space-y-0 px-4 py-3">
              <CardTitle className="text-sm">At a glance</CardTitle>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 space-y-4 overflow-hidden px-4 pb-4 pt-0">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Pending admissions</p>
                  <Link href="/admin/admissions" className="text-[11px] text-primary hover:underline">
                    View
                  </Link>
                </div>
                {admissionsLoading ? (
                  <AdminLoadingText label="Loading..." />
                ) : pendingAdmissions.length === 0 ? (
                  <p className="text-xs text-muted-foreground">None pending.</p>
                ) : (
                  <div className="space-y-1.5">
                    {pendingAdmissions.slice(0, 3).map((application) => (
                      <div key={application.id} className="rounded-md border px-2.5 py-1.5">
                        <p className="truncate text-sm font-medium">{application.applicant}</p>
                        <p className="text-[11px] text-muted-foreground">Grade {application.grade}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Upcoming events</p>
                  <Link href="/admin/events" className="text-[11px] text-primary hover:underline">
                    View
                  </Link>
                </div>
                {eventsLoading ? (
                  <AdminLoadingText label="Loading..." />
                ) : upcomingEvents.length === 0 ? (
                  <p className="text-xs text-muted-foreground">None scheduled.</p>
                ) : (
                  <div className="space-y-1.5">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="rounded-md border px-2.5 py-1.5">
                        <p className="truncate text-sm font-medium">{event.title}</p>
                        <p className="text-[11px] text-muted-foreground">{event.date}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
