"use client";

import Link from "next/link";
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
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  ScrollText,
  Settings,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";
import { visibleAdminNav, siteConfig } from "@/lib/config";
import { logout } from "@/lib/api";
import { AdminNotifications } from "@/components/admin/admin-notifications";
import { getInitials, useCurrentUser } from "@/hooks/use-current-user";
import { useAdminLoginPath, useAdminNavItem, usePublicSiteUrl } from "@/hooks/use-admin-host";
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
  Inbox,
  ScrollText,
  Settings,
  UserCog,
};

function AdminNavLink({
  item,
  onNavigate,
}: {
  item: (typeof visibleAdminNav)[number];
  onNavigate?: () => void;
}) {
  const { href, isActive } = useAdminNavItem(item.href);
  const Icon = iconMap[item.icon];

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-r-lg border-l-[3px] py-2 pl-[calc(0.75rem-3px)] pr-3 text-sm font-medium transition-colors",
        isActive
          ? "border-primary bg-primary/10 font-semibold text-primary"
          : "border-transparent text-muted-foreground hover:border-primary/30 hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      {item.label}
    </Link>
  );
}

function AdminNavGroups({ onNavigate }: { onNavigate?: () => void }) {
  const groups = visibleAdminNav.reduce<Record<string, (typeof visibleAdminNav)[number][]>>((acc, item) => {
    const group = item.group ?? "Other";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(groups).map(([group, items]) => (
        <div key={group} className="mb-3 last:mb-0">
          <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {group}
          </p>
          <div className="space-y-0.5">
            {items.map((item) => (
              <AdminNavLink key={item.href} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function AdminBrandLink({ href, onNavigate }: { href: string; onNavigate?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex min-w-0 items-center gap-2"
    >
      <SchoolLogo size="xs" href={null} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{siteConfig.name}</p>
        <p className="truncate text-xs text-muted-foreground">Admin Portal</p>
      </div>
    </Link>
  );
}

function AdminUserMenu({ compact = false }: { compact?: boolean }) {
  const { user } = useCurrentUser();
  const publicSiteUrl = usePublicSiteUrl();
  const loginPath = useAdminLoginPath();
  const displayName = user?.name ?? "Admin";
  const displayEmail = user?.email ?? "admin@skacademy.edu";
  const initials = getInitials(displayName) || "AU";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "shrink-0 rounded-lg outline-none transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
          compact ? "p-0.5" : "flex items-center gap-2 p-1.5 sm:gap-3 sm:px-2"
        )}
      >
        {!compact && (
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {user?.role === "admin" ? "Administrator" : "Staff"}
            </p>
          </div>
        )}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {initials}
        </div>
        {!compact && <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium">{displayName}</p>
          <p className="text-xs text-muted-foreground">{displayEmail}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href={publicSiteUrl} className="flex items-center gap-2" />}>
          <Home className="h-4 w-4" />
          Back to Website
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={async () => {
            try {
              await logout();
            } finally {
              window.location.href = loginPath;
            }
          }}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AdminSidebar() {
  const publicSiteUrl = usePublicSiteUrl();
  const loginPath = useAdminLoginPath();
  const dashboardHref = useAdminNavItem("/admin").href;

  return (
    <aside className="hidden h-dvh w-64 shrink-0 flex-col overflow-hidden border-r border-border bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex h-16 shrink-0 items-center border-b border-border bg-background px-4">
        <AdminBrandLink href={dashboardHref} />
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <AdminNavGroups />
      </nav>

      <div className="shrink-0 space-y-1 border-t p-3">
        <ButtonLink
          href={publicSiteUrl}
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground"
        >
          <Home className="h-4 w-4" />
          Back to Website
        </ButtonLink>
        <ButtonLink
          href={loginPath}
          variant="outline"
          className="w-full justify-start gap-3"
          onClick={async (e) => {
            e.preventDefault();
            try {
              await logout();
            } finally {
              window.location.href = loginPath;
            }
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
  const [open, setOpen] = useState(false);
  const { user } = useCurrentUser();
  const publicSiteUrl = usePublicSiteUrl();
  const loginPath = useAdminLoginPath();
  const dashboardHref = useAdminNavItem("/admin").href;
  const displayName = user?.name ?? "Admin";
  const displayEmail = user?.email ?? "admin@skacademy.edu";
  const roleLabel = user?.role === "admin" ? "Administrator" : "Staff";
  const initials = getInitials(displayName) || "AU";

  return (
    <div className="sticky top-0 z-50 flex shrink-0 items-center gap-2 border-b bg-background px-3 py-2 md:hidden">
      <AdminBrandLink href={dashboardHref} />

      <div className="ml-auto flex items-center gap-1">
        <AdminNotifications />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="outline" size="icon" className="h-10 w-10 shrink-0" aria-label="Open menu" />
            }
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="flex w-[min(100vw-2rem,18rem)] flex-col p-0">
            <SheetHeader className="border-b px-4 py-4 text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {initials}
                </div>
                <div className="min-w-0">
                  <SheetTitle className="truncate p-0 text-base font-semibold">{displayName}</SheetTitle>
                  <p className="truncate text-xs text-muted-foreground">{displayEmail}</p>
                  <p className="text-xs text-muted-foreground">{roleLabel}</p>
                </div>
              </div>
            </SheetHeader>
            <nav className="flex-1 overflow-y-auto p-3">
              <AdminNavGroups onNavigate={() => setOpen(false)} />
            </nav>
            <div className="space-y-1 border-t p-3">
              <ButtonLink
                href={publicSiteUrl}
                variant="ghost"
                className="w-full justify-start gap-3 text-muted-foreground"
                onClick={() => setOpen(false)}
              >
                <Home className="h-4 w-4" />
                Back to Website
              </ButtonLink>
              <ButtonLink
                href={loginPath}
                variant="outline"
                className="w-full justify-start gap-3"
                onClick={async (e) => {
                  e.preventDefault();
                  setOpen(false);
                  try {
                    await logout();
                  } finally {
                    window.location.href = loginPath;
                  }
                }}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </ButtonLink>
            </div>
          </SheetContent>
        </Sheet>
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

  const headerSubtitle = welcome
    ? subtitle
      ? (
          <>
            <span className="md:hidden">{subtitle}</span>
            <span className="hidden md:inline">Welcome back, {displayName} 👋 · {subtitle}</span>
          </>
        )
      : `Welcome back, ${displayName} 👋`
    : (subtitle ?? "Staff Portal");

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-4 sm:h-16 sm:px-6">
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold leading-tight sm:text-lg">{title}</h1>
        <p className="truncate text-xs leading-tight text-muted-foreground">{headerSubtitle}</p>
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <AdminNotifications />
        <AdminUserMenu />
      </div>
    </header>
  );
}
