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
  Mail,
  Users,
  type LucideIcon,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-shell";
import { AdminLoadingText, AdminStatLoading } from "@/components/admin/admin-loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchDashboard, type ContactMessageRecord, type DashboardSummary } from "@/lib/api";
import { getCached, getStale, setCached } from "@/lib/api-cache";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { formatTodayLong } from "@/lib/today";
import { cn } from "@/lib/utils";

const DASHBOARD_CACHE_KEY = "dashboard:summary";

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

function dedupeContactMessages(messages: ContactMessageRecord[]) {
  const seen = new Map<string, ContactMessageRecord>();

  for (const message of [...messages].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )) {
    const key = `${message.email.toLowerCase()}|${message.message.trim()}`;
    if (!seen.has(key)) {
      seen.set(key, message);
    }
  }

  return Array.from(seen.values());
}

function ContactMessageRow({ message }: { message: ContactMessageRecord }) {
  const isNew = (message.status ?? "new") === "new";
  const initial = message.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <Link
      href="/admin/inbox"
      className="flex gap-3 rounded-lg border bg-background px-3 py-2.5 transition-colors hover:border-primary/30 hover:bg-muted/30"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
        {initial}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{message.name}</p>
            <p className="truncate text-xs text-muted-foreground">{message.email}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {isNew && <span className="h-2 w-2 rounded-full bg-amber-500" title="New" />}
            <span className="text-[11px] text-muted-foreground">
              {formatRelativeTime(new Date(message.createdAt))}
            </span>
          </div>
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{message.message}</p>
        {message.phone && (
          <p className="mt-1 text-[11px] text-muted-foreground">{message.phone}</p>
        )}
      </div>
    </Link>
  );
}

export default function AdminDashboardPage() {
  const todayLabel = formatTodayLong();
  const [loading, setLoading] = useState(!getCached<DashboardSummary>(DASHBOARD_CACHE_KEY));
  const [dashboard, setDashboard] = useState<DashboardSummary | undefined>(() =>
    getStale<DashboardSummary>(DASHBOARD_CACHE_KEY)
  );

  useEffect(() => {
    let cancelled = false;
    const cached = getCached<DashboardSummary>(DASHBOARD_CACHE_KEY);

    if (cached) {
      setDashboard(cached);
      setLoading(false);
      return;
    }

    const stale = getStale<DashboardSummary>(DASHBOARD_CACHE_KEY);
    if (!stale) {
      setLoading(true);
    }

    void fetchDashboard()
      .then((data) => {
        if (!cancelled) {
          setCached(DASHBOARD_CACHE_KEY, data);
          setDashboard(data);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const recentContactMessages = useMemo(
    () => dedupeContactMessages(dashboard?.contactMessages ?? []),
    [dashboard?.contactMessages]
  );

  const stats = dashboard?.stats;
  const pendingAdmissions = dashboard?.pendingAdmissions ?? [];
  const upcomingEvents = dashboard?.upcomingEvents ?? [];

  const dashboardStats = [
    {
      label: "Students",
      loading,
      value: String(stats?.students ?? 0),
      change: `${stats?.activeStudents ?? 0} active`,
      icon: "GraduationCap" as const,
      href: "/admin/students",
    },
    {
      label: "Teachers",
      loading,
      value: String(stats?.teachers ?? 0),
      change: "On staff",
      icon: "Users" as const,
      href: "/admin/teachers",
    },
    {
      label: "Contact Us",
      loading,
      value: String(stats?.contactNew ?? 0),
      change: loading
        ? "Loading..."
        : (stats?.contactNew ?? 0) === 0
          ? "No new messages"
          : `${stats?.contactTotal ?? 0} total submission${(stats?.contactTotal ?? 0) === 1 ? "" : "s"}`,
      icon: "Inbox" as const,
      href: "/admin/inbox",
    },
    {
      label: "Admissions",
      loading,
      value: String(stats?.pendingAdmissions ?? 0),
      change: (stats?.pendingAdmissions ?? 0) === 0 ? "None pending" : "Pending review",
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
                      <p className="truncate text-xs text-muted-foreground">{stat.change}</p>
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
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <CardTitle className="text-sm">Contact Us messages</CardTitle>
                  <p className="text-xs text-muted-foreground">Latest emails from the website contact form</p>
                </div>
              </div>
              <Link href="/admin/inbox" className="text-xs font-medium text-primary hover:underline">
                View all
              </Link>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 pb-4 pt-0 pr-3">
              {loading ? (
                <AdminLoadingText label="Loading messages..." />
              ) : recentContactMessages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No contact messages yet.</p>
              ) : (
                recentContactMessages.map((message) => (
                  <ContactMessageRow key={message._id} message={message} />
                ))
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
                {loading ? (
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
                {loading ? (
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
