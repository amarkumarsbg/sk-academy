"use client";

import { useMemo, useState } from "react";
import { AdminHeader } from "@/components/admin/admin-shell";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { ImageUploadField } from "@/components/admin/cms-form-fields";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useResource } from "@/hooks/use-resource";
import {
  STUDENT_CLASSES,
  STUDENT_STATUSES,
  generateNextStudentId,
  getInitials,
} from "@/lib/student-utils";
import type { StudentRecord } from "@/types/student";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";

const PAGE_SIZE = 10;

const emptyStudent = (): StudentRecord => ({
  id: "",
  name: "",
  class: "Class 1",
  rollNo: "",
  status: "Active",
  parent: "",
  parentPhone: "",
  parentEmail: "",
  photo: "",
});

function statusVariant(status: string) {
  if (status === "Active") return "default";
  if (status === "Graduated") return "secondary";
  return "outline";
}

export function StudentsPageContent() {
  const { items, loading, error, create, update, remove } = useResource<StudentRecord>("students");

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<StudentRecord | null>(null);
  const [form, setForm] = useState<StudentRecord>(emptyStudent());
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<StudentRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const classOptions = useMemo(() => {
    const fromData = items.map((s) => s.class).filter(Boolean);
    return ["All", ...Array.from(new Set([...STUDENT_CLASSES, ...fromData]))];
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((student) => {
      const matchesSearch =
        !q ||
        student.name.toLowerCase().includes(q) ||
        student.id.toLowerCase().includes(q) ||
        student.rollNo.toLowerCase().includes(q);
      const matchesClass = classFilter === "All" || student.class === classFilter;
      const matchesStatus = statusFilter === "All" || student.status === statusFilter;
      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [items, search, classFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const pageEnd = Math.min(currentPage * PAGE_SIZE, filtered.length);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function openCreate() {
    const nextId = generateNextStudentId(items.map((s) => s.id));
    setEditing(null);
    setForm({ ...emptyStudent(), id: nextId });
    setFormError("");
    setFormOpen(true);
  }

  function openEdit(student: StudentRecord) {
    setEditing(student);
    setForm({ ...student });
    setFormError("");
    setFormOpen(true);
  }

  async function handleSubmit() {
    if (!form.name.trim()) {
      setFormError("Student name is required.");
      return;
    }
    if (!form.rollNo.trim()) {
      setFormError("Roll number is required.");
      return;
    }

    setSubmitting(true);
    setFormError("");
    try {
      if (editing) {
        await update(editing.id, form);
      } else {
        await create(form);
      }
      setFormOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await remove(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  const columns = [
    {
      key: "photo",
      label: "Photo",
      render: (row: StudentRecord) => (
        <Avatar size="sm">
          {row.photo ? <AvatarImage src={row.photo} alt={row.name} /> : null}
          <AvatarFallback>{getInitials(row.name) || "?"}</AvatarFallback>
        </Avatar>
      ),
    },
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "class", label: "Class" },
    { key: "rollNo", label: "Roll No" },
    { key: "parent", label: "Parent" },
    {
      key: "status",
      label: "Status",
      render: (row: StudentRecord) => (
        <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: StudentRecord) => (
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button size="sm" variant="outline" onClick={() => openEdit(row)} aria-label="Edit student">
                  <Pencil className="h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setDeleteTarget(row)}
                  aria-label="Delete student"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminHeader title="Students" />
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading..." : `${items.length} students total`}
          </p>
          <Button size="sm" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>

        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by name, ID, roll no..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              value={classFilter}
              onValueChange={(v) => {
                setClassFilter(v ?? "All");
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                {classOptions.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls === "All" ? "All Classes" : cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v ?? "All");
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                {STUDENT_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

        {filtered.length > 0 ? (
          <>
            <AdminDataTable columns={columns} data={paginated} />
            <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              Showing {pageStart}-{pageEnd} of {filtered.length} students
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, idx, arr) => {
                  const prev = arr[idx - 1];
                  const showEllipsis = prev !== undefined && p - prev > 1;
                  return (
                    <span key={p} className="flex items-center gap-2">
                      {showEllipsis && <span className="text-muted-foreground">…</span>}
                      <Button
                        size="sm"
                        variant={p === currentPage ? "default" : "outline"}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    </span>
                  );
                })}
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
            </div>
          </>
        ) : (
          !loading && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
              <p className="mb-4 text-sm text-muted-foreground">
                {search || classFilter !== "All" || statusFilter !== "All"
                  ? "No students match your search or filters."
                  : "No students found."}
              </p>
              <Button size="sm" onClick={openCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </div>
          )
        )}
      </div>

      {/* Add / Edit dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Student" : "Add Student"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="student-id">Student ID</Label>
              <Input id="student-id" value={form.id} readOnly className="bg-muted" />
              <p className="text-xs text-muted-foreground">Auto-generated</p>
            </div>
            <ImageUploadField
              label="Student photo"
              value={form.photo ?? ""}
              onChange={(photo) => setForm({ ...form, photo })}
              previewClassName="aspect-square max-h-32 max-w-32"
            />
            <div className="space-y-2">
              <Label htmlFor="student-name">Name</Label>
              <Input
                id="student-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full name"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Class</Label>
                <Select value={form.class} onValueChange={(v) => setForm({ ...form, class: v ?? "" })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {STUDENT_CLASSES.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        {cls}
                      </SelectItem>
                    ))}
                    {!STUDENT_CLASSES.includes(form.class as (typeof STUDENT_CLASSES)[number]) && form.class && (
                      <SelectItem value={form.class}>{form.class}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roll-no">Roll No</Label>
                <Input
                  id="roll-no"
                  value={form.rollNo}
                  onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
                  placeholder="e.g. 15"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v ?? "Active" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STUDENT_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent-name">Parent Name</Label>
              <Input
                id="parent-name"
                value={form.parent}
                onChange={(e) => setForm({ ...form, parent: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="parent-phone">Parent Phone</Label>
                <Input
                  id="parent-phone"
                  type="tel"
                  value={form.parentPhone ?? ""}
                  onChange={(e) => setForm({ ...form, parentPhone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent-email">Parent Email</Label>
                <Input
                  id="parent-email"
                  type="email"
                  value={form.parentEmail ?? ""}
                  onChange={(e) => setForm({ ...form, parentEmail: e.target.value })}
                  placeholder="parent@email.com"
                />
              </div>
            </div>
            {formError && <p className="text-sm text-destructive">{formError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Student</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">{deleteTarget?.name}</span> (
              {deleteTarget?.id})? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
