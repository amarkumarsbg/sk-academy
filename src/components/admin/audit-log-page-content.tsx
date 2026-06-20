"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/admin-shell";
import { AdminPageLoading } from "@/components/admin/admin-loading";
import { Card, CardContent } from "@/components/ui/card";
import { fetchAuditLog, type AuditLogRecord } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { formatDateTimeLong } from "@/lib/format-relative-time";

export function AuditLogPageContent() {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setLogs(await fetchAuditLog());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load audit log");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <AdminHeader title="Audit Log" />
      <div className="p-6">
        {loading ? (
          <AdminPageLoading label="Loading audit log..." />
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <Card key={log._id}>
                <CardContent className="py-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{log.summary}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {log.userName} · {log.action} · {log.resource}
                      </p>
                    </div>
                    <time className="shrink-0 text-xs text-muted-foreground">
                      {formatDateTimeLong(new Date(log.createdAt))}
                    </time>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
