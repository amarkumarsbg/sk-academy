"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminHeader } from "@/components/admin/admin-shell";
import { AdminLoadingText, AdminPageLoading, AdminButtonSpinner } from "@/components/admin/admin-loading";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useResource } from "@/hooks/use-resource";
import { generateNextId } from "@/lib/id-utils";
import { getTodayISO } from "@/lib/today";
import type { StudentRecord } from "@/types/student";
import { Check, Plus, Save, Search } from "lucide-react";

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  date: string;
  status: "Present" | "Absent" | "Late";
}

type AttendanceStatus = AttendanceRecord["status"];

export function AttendancePageContent() {
  const { items: students, loading: studentsLoading } = useResource<StudentRecord>("students");
  const { items, loading, error, create, update, load } = useResource<AttendanceRecord>("attendance");

  const [date, setDate] = useState(getTodayISO());
  const [selectedClass, setSelectedClass] = useState("");
  const [rollCall, setRollCall] = useState<Record<string, AttendanceStatus>>({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [search, setSearch] = useState("");
  const [historyClassFilter, setHistoryClassFilter] = useState("All");

  const classOptions = useMemo(() => {
    const fromStudents = students.map((s) => s.class).filter(Boolean);
    const fromRecords = items.map((r) => r.class).filter(Boolean);
    return Array.from(new Set([...fromStudents, ...fromRecords])).sort();
  }, [students, items]);

  const classStudents = useMemo(() => {
    if (!selectedClass) return [];
    return students
      .filter((s) => s.class === selectedClass && s.status === "Active")
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [students, selectedClass]);

  // Sync roll call from existing records when date/class changes
  useEffect(() => {
    if (!selectedClass || !date) return;
    const existing = items.filter((r) => r.date === date && r.class === selectedClass);
    const map: Record<string, AttendanceStatus> = {};
    for (const student of classStudents) {
      const record = existing.find((r) => r.studentId === student.id);
      map[student.id] = record?.status ?? "Present";
    }
    setRollCall(map);
  }, [selectedClass, date, classStudents, items]);

  const filteredHistory = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items
      .filter((r) => {
        const matchesSearch =
          !q ||
          r.studentName.toLowerCase().includes(q) ||
          r.studentId.toLowerCase().includes(q) ||
          r.class.toLowerCase().includes(q);
        const matchesClass = historyClassFilter === "All" || r.class === historyClassFilter;
        return matchesSearch && matchesClass;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [items, search, historyClassFilter]);

  function togglePresent(studentId: string) {
    setRollCall((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "Present" ? "Absent" : "Present",
    }));
  }

  function setStatus(studentId: string, status: AttendanceStatus) {
    setRollCall((prev) => ({ ...prev, [studentId]: status }));
  }

  function markAllPresent() {
    const map: Record<string, AttendanceStatus> = {};
    for (const student of classStudents) {
      map[student.id] = "Present";
    }
    setRollCall(map);
  }

  async function saveRollCall() {
    if (!selectedClass || !date || classStudents.length === 0) return;
    setSaving(true);
    setSaveMessage("");
    try {
      const existing = items.filter((r) => r.date === date && r.class === selectedClass);
      const existingIds = items.map((r) => r.id);

      for (const student of classStudents) {
        const status = rollCall[student.id] ?? "Present";
        const found = existing.find((r) => r.studentId === student.id);
        const payload: AttendanceRecord = {
          id: found?.id ?? generateNextId("ATT", existingIds),
          studentId: student.id,
          studentName: student.name,
          class: selectedClass,
          date,
          status,
        };
        if (found) {
          await update(found.id, payload);
        } else {
          await create(payload);
          existingIds.push(payload.id);
        }
      }
      await load();
      setSaveMessage(`Attendance saved for ${classStudents.length} students.`);
    } catch (err) {
      setSaveMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const presentCount = Object.values(rollCall).filter((s) => s === "Present").length;
  const absentCount = Object.values(rollCall).filter((s) => s === "Absent").length;
  const lateCount = Object.values(rollCall).filter((s) => s === "Late").length;

  const historyColumns = [
    { key: "date", label: "Date" },
    { key: "class", label: "Class" },
    { key: "studentName", label: "Student" },
    {
      key: "status",
      label: "Status",
      render: (row: AttendanceRecord) => (
        <Badge
          variant={
            row.status === "Present" ? "default" : row.status === "Late" ? "secondary" : "outline"
          }
        >
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <>
      <AdminHeader title="Attendance" />
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        {/* Roll call section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Mark Attendance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="attendance-date">Date</Label>
                <Input
                  id="attendance-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Class</Label>
                <Select
                  value={selectedClass}
                  onValueChange={(v) => setSelectedClass(v ?? "")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classOptions.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedClass && (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-muted-foreground">
                    {studentsLoading ? (
                      <AdminLoadingText label="Loading students..." />
                    ) : (
                      <>
                        {`${classStudents.length} students in ${selectedClass}`}
                        {classStudents.length > 0 && (
                          <span className="ml-2">
                            · {presentCount} present · {absentCount} absent · {lateCount} late
                          </span>
                        )}
                      </>
                    )}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={markAllPresent}>
                      Mark All Present
                    </Button>
                    <Button size="sm" onClick={saveRollCall} disabled={saving || classStudents.length === 0}>
                      {saving ? (
                        <AdminButtonSpinner label="Saving..." />
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Attendance
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {saveMessage && (
                  <p className={`text-sm ${saveMessage.includes("failed") ? "text-destructive" : "text-green-600"}`}>
                    {saveMessage}
                  </p>
                )}

                {studentsLoading ? (
                  <AdminPageLoading label="Loading students..." />
                ) : classStudents.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No active students found in {selectedClass}.
                  </p>
                ) : (
                  <div className="divide-y rounded-lg border">
                    {classStudents.map((student) => {
                      const status = rollCall[student.id] ?? "Present";
                      const isPresent = status === "Present";
                      return (
                        <div
                          key={student.id}
                          className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                        >
                          <button
                            type="button"
                            className="flex items-center gap-3 text-left"
                            onClick={() => togglePresent(student.id)}
                          >
                            <span
                              className={`flex h-5 w-5 items-center justify-center rounded border ${
                                isPresent
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-muted-foreground/40 bg-background"
                              }`}
                            >
                              {isPresent && <Check className="h-3 w-3" />}
                            </span>
                            <span className={isPresent ? "font-medium" : "text-muted-foreground line-through"}>
                              {student.name}
                            </span>
                            <span className="text-xs text-muted-foreground">({student.rollNo})</span>
                          </button>
                          <div className="flex gap-1">
                            {(["Present", "Absent", "Late"] as AttendanceStatus[]).map((s) => (
                              <Button
                                key={s}
                                size="sm"
                                variant={status === s ? "default" : "outline"}
                                onClick={() => setStatus(student.id, s)}
                              >
                                {s}
                              </Button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {!selectedClass && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Select a date and class to mark attendance for the whole class at once.
              </p>
            )}
          </CardContent>
        </Card>

        {/* History section */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-medium">Attendance History</h2>
          <p className="text-sm text-muted-foreground">
            {loading ? <AdminLoadingText /> : `${items.length} records`}
          </p>
        </div>

        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search student or class..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={historyClassFilter}
            onValueChange={(v) => setHistoryClassFilter(v ?? "All")}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Classes</SelectItem>
              {classOptions.map((cls) => (
                <SelectItem key={cls} value={cls}>
                  {cls}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

        {loading && filteredHistory.length === 0 ? (
          <AdminPageLoading label="Loading attendance..." />
        ) : filteredHistory.length > 0 ? (
          <AdminDataTable columns={historyColumns} data={filteredHistory} />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
              <p className="mb-4 text-sm text-muted-foreground">No attendance records found.</p>
              <Button
                size="sm"
                onClick={() => {
                  if (classOptions.length > 0) setSelectedClass(classOptions[0]);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Mark Attendance
              </Button>
            </div>
        )}
      </div>
    </>
  );
}
