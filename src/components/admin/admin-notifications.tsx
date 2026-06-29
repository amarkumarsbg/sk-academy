"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { fetchInboxCounts } from "@/lib/api";
import { useAdminNavItem } from "@/hooks/use-admin-host";
import { cn } from "@/lib/utils";

export function AdminNotifications({ className }: { className?: string }) {
  const { href } = useAdminNavItem("/admin/inbox");
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchInboxCounts()
      .then((data) => setCount(data.total))
      .catch(() => setCount(0));
  }, []);

  return (
    <Link
      href={href}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        className
      )}
      aria-label={count > 0 ? `${count} unread notifications` : "Notifications"}
    >
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
