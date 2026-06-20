"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  Menu,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import { adminNav, siteConfig } from "@/lib/config";
import { logout } from "@/lib/api";
import { getInitials, useCurrentUser } from "@/hooks/use-current-user";
import { SchoolLogo } from "@/components/public/school-logo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
    <aside className="hidden h-dvh w-64 shrink-0 flex-col overflow-hidden border-r border-border bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
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
          onClick={async (e) => {
            e.preventDefault();
            await logout();
            window.location.href = "/admin/login";
          }}
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
  const [open, setOpen] = useState(false);

  return (
    <div className="flex shrink-0 items-center gap-2 border-b bg-background p-2 md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="outline" size="sm" className="shrink-0" />}>
          <Menu className="h-4 w-4" />
          Menu
        </SheetTrigger>
        <SheetContent side="left" className="w-[min(100vw-2rem,18rem)] p-0">
          <SheetHeader className="border-b px-4 py-4 text-left">
            <SheetTitle className="flex items-center gap-2">
              <SchoolLogo size="xs" href="/admin" />
              {siteConfig.name}
            </SheetTitle>
          </SheetHeader>
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
                  onClick={() => setOpen(false)}
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
          <div className="space-y-1 border-t p-3">
            <ButtonLink
              href="/"
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground"
              onClick={() => setOpen(false)}
            >
              <Home className="h-4 w-4" />
              Back to Website
            </ButtonLink>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
        {adminNav.slice(0, 4).map((item) => {
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
    </div>
  );
}

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  welcome?: boolean;
}

export function AdminHeader({ title, subtitle, welcome = false }: AdminHeaderProps) {
  const { user } = useCurrentUser();
  const displayName = user?.name ?? "Admin";
  const displayEmail = user?.email ?? "admin@skacademy.edu";
  const roleLabel = user?.role === "admin" ? "Administrator" : "Staff";
  const initials = getInitials(displayName) || "AU";

  const headerSubtitle = welcome
    ? subtitle
      ? `Welcome back, ${displayName} 👋 · ${subtitle}`
      : `Welcome back, ${displayName} 👋`
    : (subtitle ?? "Staff Portal");

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-4 sm:px-6">
      <div className="min-w-0">
        <h1 className="truncate text-base font-semibold leading-tight sm:text-lg">{title}</h1>
        <p className="truncate text-xs leading-tight text-muted-foreground">{headerSubtitle}</p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg p-1.5 outline-none transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring sm:gap-3 sm:px-2">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="mt-1 text-xs text-muted-foreground">{roleLabel}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {initials}
          </div>
          <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="font-normal">
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground">{displayEmail}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/" className="flex items-center gap-2" />}>
            <Home className="h-4 w-4" />
            Back to Website
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={async () => {
              await logout();
              window.location.href = "/admin/login";
            }}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
