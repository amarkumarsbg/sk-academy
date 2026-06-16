"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  Bell,
  Calendar,
  CalendarCheck,
  ChevronDown,
  ClipboardList,
  FileText,
  Globe,
  GraduationCap,
  Home,
  IndianRupee,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import { adminNav, siteConfig } from "@/lib/config";
import { SchoolLogo } from "@/components/public/school-logo";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button-link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  GraduationCap,
  Users,
  ClipboardList,
  CalendarCheck,
  IndianRupee,
  FileText,
  Award,
  Bell,
  Calendar,
  Globe,
  Settings,
};

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-dvh w-64 shrink-0 flex-col overflow-hidden border-r bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SchoolLogo size="xs" href="/admin" />
        <div>
          <p className="text-sm font-semibold">{siteConfig.name}</p>
          <p className="text-xs text-muted-foreground">Admin Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {adminNav.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 space-y-1 border-t p-3">
        <ButtonLink
          href="/"
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground"
        >
          <Home className="h-4 w-4" />
          Back to Website
        </ButtonLink>
        <ButtonLink
          href="/admin/login"
          variant="outline"
          className="w-full justify-start gap-3"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </ButtonLink>
      </div>
    </aside>
  );
}

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <div className="flex shrink-0 gap-1 overflow-x-auto border-b bg-background p-2 md:hidden">
      {adminNav.slice(0, 6).map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "shrink-0 rounded-md px-3 py-1.5 text-xs font-medium",
              isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

export function AdminHeader({ title }: { title: string }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 sm:px-6">
      <div>
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className="text-xs text-muted-foreground">Demo mode · Mock data only</p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg p-1.5 outline-none transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring sm:gap-3 sm:px-2">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium leading-none">Admin User</p>
            <p className="mt-1 text-xs text-muted-foreground">Super Admin</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            AU
          </div>
          <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="font-normal">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@skacademy.edu</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/" className="flex items-center gap-2" />}>
            <Home className="h-4 w-4" />
            Back to Website
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            render={<Link href="/admin/login" className="flex items-center gap-2" />}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
