import Link from "next/link";
import {
  Award,
  CalendarCheck,
  GraduationCap,
  IndianRupee,
  Users,
  type LucideIcon,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dashboardStats, recentActivities } from "@/data/mock";

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  Users,
  CalendarCheck,
  IndianRupee,
};

export default function AdminDashboardPage() {
  return (
    <>
      <AdminHeader title="Dashboard" />
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((stat) => {
            const Icon = iconMap[stat.icon];
            return (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {recentActivities.map((activity, i) => (
                  <li key={i} className="flex items-start justify-between gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.detail}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{activity.time}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {[
                { label: "Add Student", href: "/admin/students", icon: GraduationCap },
                { label: "Mark Attendance", href: "/admin/attendance", icon: CalendarCheck },
                { label: "Record Fee", href: "/admin/fees", icon: IndianRupee },
                { label: "Publish Notice", href: "/admin/notices", icon: Award },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors hover:bg-accent"
                >
                  <action.icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium">{action.label}</span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 border-dashed">
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <Badge variant="secondary" className="mb-2">Frontend Demo</Badge>
              <p className="text-sm text-muted-foreground">
                All data shown is mock data. Backend API integration planned for a future phase.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
