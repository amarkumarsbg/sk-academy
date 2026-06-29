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
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminHeader } from "@/components/admin/admin-shell";
import { AdminLoadingText, AdminStatLoading } from "@/components/admin/admin-loading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchDashboard, type ContactMessageRecord, type DashboardSummary } from "@/lib/api";
import { getCached, getStale, setCached } from "@/lib/api-cache";
import { getAvatarColor } from "@/lib/admin-ui";
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

const statCardStyles = {
  GraduationCap: {
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    ring: "hover:ring-blue-200",
  },
  Users: {
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    ring: "hover:ring-violet-200",
  },
  Inbox: {
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    ring: "hover:ring-amber-200",
  },
  ClipboardList: {
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    ring: "hover:ring-emerald-200",
  },
} as const;

const quickActions = [
  {
    label: "Add Student",
    href: "/admin/students",
    icon: GraduationCap,
    iconClass: "text-blue-700",
    bgClass: "bg-blue-100/90 border-blue-200/80 hover:bg-blue-100",
  },
  {
    label: "Inbox",
    href: "/admin/inbox",
    icon: Inbox,
    iconClass: "text-amber-700",
    bgClass: "bg-amber-100/90 border-amber-200/80 hover:bg-amber-100",
  },
  {
    label: "Admissions",
    href: "/admin/admissions",
    icon: ClipboardList,
    iconClass: "text-emerald-700",
    bgClass: "bg-emerald-100/90 border-emerald-200/80 hover:bg-emerald-100",
  },
  {
    label: "CMS",
    href: "/admin/cms",
    icon: Globe,
    iconClass: "text-violet-700",
    bgClass: "bg-violet-100/90 border-violet-200/80 hover:bg-violet-100",
  },
  {
    label: "Notices",
    href: "/admin/notices",
    icon: Bell,
    iconClass: "text-rose-700",
    bgClass: "bg-rose-100/90 border-rose-200/80 hover:bg-rose-100",
  },
  {
    label: "Events",
    href: "/admin/events",
    icon: Calendar,
    iconClass: "text-sky-700",
    bgClass: "bg-sky-100/90 border-sky-200/80 hover:bg-sky-100",
  },
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
  const isUnread = (message.status ?? "new") === "new";
  const initial = message.name.trim().charAt(0).toUpperCase() || "?";
  const avatarColor = getAvatarColor(message.email || message.name);

  return (
    <Link
      href="/admin/inbox"
      className="group flex gap-3 rounded-xl border bg-background px-3 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white",
          avatarColor
        )}
      >
        {initial}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-semibold">{message.name}</p>
              {isUnread && (
                <Badge className="border-amber-200 bg-amber-50 text-[10px] text-amber-800 hover:bg-amber-50">
                  Unread
                </Badge>
              )}
            </div>
            <p className="truncate text-xs text-muted-foreground">{message.email}</p>
          </div>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {formatRelativeTime(new Date(message.createdAt))}
          </span>
        </div>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {message.message}
        </p>
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
  const unreadCount = stats?.contactNew ?? 0;

  const dashboardStats = [
    {
      label: "Students",
      loading,
      value: String(stats?.students ?? 0),
      trend: `${stats?.activeStudents ?? 0} active enrolled`,
      icon: "GraduationCap" as const,
      href: "/admin/students",
    },
    {
      label: "Teachers",
      loading,
      value: String(stats?.teachers ?? 0),
      trend: "On staff",
      icon: "Users" as const,
      href: "/admin/teachers",
    },
    {
      label: "Contact Us",
      loading,
      value: String(unreadCount),
      trend:
        unreadCount > 0
          ? `${unreadCount} unread · ${stats?.contactTotal ?? 0} total`
          : `${stats?.contactTotal ?? 0} total submissions`,
      icon: "Inbox" as const,
      href: "/admin/inbox",
    },
    {
      label: "Admissions",
      loading,
      value: String(stats?.pendingAdmissions ?? 0),
      trend:
        (stats?.pendingAdmissions ?? 0) > 0
          ? `${stats?.pendingAdmissions} pending review`
          : "No pending applications",
      icon: "ClipboardList" as const,
      href: "/admin/admissions",
    },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" welcome subtitle={todayLabel} />
      <div className="p-4 pb-8 sm:p-5">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {dashboardStats.map((stat) => {
            const Icon = iconMap[stat.icon];
            const style = statCardStyles[stat.icon];
            return (
              <Link key={stat.label} href={stat.href} className="block">
                <Card
                  className={cn(
                    "ring-1 ring-transparent transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                    style.ring
                  )}
                >
                  <CardContent className="flex items-start justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                      {stat.loading ? (
                        <AdminStatLoading />
                      ) : (
                        <p className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                          {stat.value}
                        </p>
                      )}
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{stat.trend}</p>
                    </div>
                    {Icon && (
                      <div
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                          style.iconBg
                        )}
                      >
                        <Icon className={cn("h-5 w-5", style.iconColor)} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <Card className="mt-4 shadow-sm">
          <CardContent className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 md:grid-cols-6">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={cn(
                  "flex h-24 flex-col items-center justify-center gap-2 rounded-xl border px-2 py-3 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                  action.bgClass
                )}
              >
                <action.icon className={cn("h-5 w-5", action.iconClass)} />
                <span className="text-xs font-semibold leading-tight">{action.label}</span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <Card className="flex flex-col shadow-sm lg:col-span-2">
            <CardHeader className="flex shrink-0 flex-row items-center justify-between space-y-0 px-4 py-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <CardTitle className="text-sm">Contact Us messages</CardTitle>
                  <p className="text-xs text-muted-foreground">Latest from the website contact form</p>
                </div>
              </div>
              <Link href="/admin/inbox" className="text-xs font-medium text-primary hover:underline">
                View all
              </Link>
            </CardHeader>
            <CardContent className="space-y-2 px-4 pb-4 pt-0">
              {loading ? (
                <AdminLoadingText label="Loading messages..." />
              ) : recentContactMessages.length === 0 ? (
                <AdminEmptyState
                  icon={Inbox}
                  title="No messages yet"
                  description="Contact form submissions from the website will appear here."
                  className="py-10"
                />
              ) : (
                recentContactMessages.map((message) => (
                  <ContactMessageRow key={message._id} message={message} />
                ))
              )}
            </CardContent>
          </Card>

          <Card className="flex flex-col shadow-sm">
            <CardHeader className="shrink-0 space-y-0 px-4 py-3">
              <CardTitle className="text-sm">At a glance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-4 pb-4 pt-0">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Pending admissions</p>
                  <Link href="/admin/admissions" className="text-xs text-primary hover:underline">
                    View
                  </Link>
                </div>
                {loading ? (
                  <AdminLoadingText label="Loading..." />
                ) : pendingAdmissions.length === 0 ? (
                  <p className="text-xs text-muted-foreground">None pending.</p>
                ) : (
                  <div className="space-y-2">
                    {pendingAdmissions.slice(0, 3).map((application) => (
                      <div
                        key={application.id}
                        className="rounded-lg border border-amber-200/80 bg-amber-50/50 px-3 py-2"
                      >
                        <p className="truncate text-sm font-medium">{application.applicant}</p>
                        <p className="text-xs text-muted-foreground">Grade {application.grade}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Upcoming events</p>
                  <Link href="/admin/events" className="text-xs text-primary hover:underline">
                    View
                  </Link>
                </div>
                {loading ? (
                  <AdminLoadingText label="Loading..." />
                ) : upcomingEvents.length === 0 ? (
                  <p className="text-xs text-muted-foreground">None scheduled.</p>
                ) : (
                  <div className="space-y-2">
                    {upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="rounded-lg border border-blue-200/80 bg-blue-50/50 px-3 py-2"
                      >
                        <p className="truncate text-sm font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.date}</p>
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
