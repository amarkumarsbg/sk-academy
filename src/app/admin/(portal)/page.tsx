"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Award,
  CalendarCheck,
  GraduationCap,
  IndianRupee,
  Users,
  type LucideIcon,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-shell";
import { AdminLoadingText, AdminStatLoading } from "@/components/admin/admin-loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useResource } from "@/hooks/use-resource";
import { formatIndianRupees } from "@/lib/format-currency";
import { adminFeatures } from "@/lib/config";
import { formatTodayLong, getTodayISO } from "@/lib/today";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  Users,
  CalendarCheck,
  IndianRupee,
};

const quickActions = [
  {
    label: "Add Student",
    href: "/admin/students",
    icon: GraduationCap,
    iconClass: "text-blue-600",
    bgClass: "bg-blue-50 hover:bg-blue-100/80",
  },
  ...(adminFeatures.attendance
    ? [
        {
          label: "Mark Attendance",
          href: "/admin/attendance",
          icon: CalendarCheck,
          iconClass: "text-emerald-600",
          bgClass: "bg-emerald-50 hover:bg-emerald-100/80",
        },
      ]
    : []),
  ...(adminFeatures.fees
    ? [
        {
          label: "Record Fee",
          href: "/admin/fees",
          icon: IndianRupee,
          iconClass: "text-orange-600",
          bgClass: "bg-orange-50 hover:bg-orange-100/80",
        },
      ]
    : []),
  {
    label: "Manage CMS",
    href: "/admin/cms",
    icon: Award,
    iconClass: "text-violet-600",
    bgClass: "bg-violet-50 hover:bg-violet-100/80",
  },
] as const;

export default function AdminDashboardPage() {
  const today = getTodayISO();
  const todayLabel = formatTodayLong();

  const { items: students, loading: studentsLoading } = useResource<{ id: string; status: string }>("students");
  const { items: teachers, loading: teachersLoading } = useResource<{ id: string }>("teachers");
  const { items: fees, loading: feesLoading } = useResource<{ id: string; due: number; status: string }>("fees", {
    enabled: adminFeatures.fees,
  });
  const { items: attendance, loading: attendanceLoading } = useResource<{
    id: string;
    status: string;
    date: string;
  }>("attendance", { enabled: adminFeatures.attendance });

  const activeStudents = students.filter((s) => s.status === "Active").length;

  const pendingFees = fees.filter((f) => f.status !== "Paid");
  const pendingAmount = pendingFees.reduce((sum, f) => sum + (f.due ?? 0), 0);

  const todayAttendance = useMemo(
    () => attendance.filter((record) => record.date === today),
    [attendance, today]
  );
  const presentToday = todayAttendance.filter((r) => r.status === "Present").length;
  const absentToday = todayAttendance.filter((r) => r.status === "Absent").length;
  const lateToday = todayAttendance.filter((r) => r.status === "Late").length;
  const attendanceRate =
    todayAttendance.length > 0
      ? Math.round((presentToday / todayAttendance.length) * 100)
      : null;

  const dashboardStats = [
    {
      label: "Total Students",
      loading: studentsLoading,
      value: String(students.length),
      change: `${activeStudents} active · ${students.length} enrolled`,
      icon: "GraduationCap" as const,
    },
    {
      label: "Teachers",
      loading: teachersLoading,
      value: String(teachers.length),
      change: `${teachers.length} on staff`,
      icon: "Users" as const,
    },
    ...(adminFeatures.attendance
      ? [
          {
            label: "Today's Attendance",
            loading: attendanceLoading,
            value: attendanceRate !== null ? `${attendanceRate}%` : "Not marked",
            change:
              todayAttendance.length > 0
                ? `${presentToday} present · ${absentToday} absent${lateToday > 0 ? ` · ${lateToday} late` : ""}`
                : "No attendance recorded for today",
            href: todayAttendance.length === 0 ? "/admin/attendance" : undefined,
            icon: "CalendarCheck" as const,
          },
        ]
      : []),
    ...(adminFeatures.fees
      ? [
          {
            label: "Pending Fees",
            loading: feesLoading,
            value: formatIndianRupees(pendingAmount),
            change:
              pendingFees.length === 0
                ? "All fees collected"
                : `${pendingFees.length} student${pendingFees.length === 1 ? "" : "s"} pending`,
            href: pendingFees.length > 0 ? "/admin/fees" : undefined,
            icon: "IndianRupee" as const,
          },
        ]
      : []),
  ];

  return (
    <>
      <AdminHeader title="Dashboard" welcome subtitle={todayLabel} />
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((stat) => {
            const Icon = iconMap[stat.icon];
            const content = (
              <Card className={cn(stat.href && "transition-colors hover:border-primary/30")}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                </CardHeader>
                <CardContent>
                  {stat.loading ? (
                    <AdminStatLoading />
                  ) : (
                    <p className="text-2xl font-bold">{stat.value}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {stat.loading ? <AdminLoadingText label="Loading..." className="mt-2" /> : stat.change}
                  </p>
                </CardContent>
              </Card>
            );

            return stat.href ? (
              <Link key={stat.label} href={stat.href} className="block">
                {content}
              </Link>
            ) : (
              <div key={stat.label}>{content}</div>
            );
          })}
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={cn(
                  "flex flex-col items-center gap-3 rounded-lg border p-4 text-center transition-colors",
                  action.bgClass
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                  <action.icon className={cn("h-5 w-5", action.iconClass)} />
                </div>
                <span className="text-xs font-medium">{action.label}</span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
