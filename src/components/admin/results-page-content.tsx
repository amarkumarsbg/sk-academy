"use client";

import { useMemo, useState } from "react";
import { AdminHeader } from "@/components/admin/admin-shell";
import { AdminLoadingText, AdminPageLoading } from "@/components/admin/admin-loading";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AddItemButton, ListItemCard } from "@/components/admin/cms-form-fields";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { useResource } from "@/hooks/use-resource";
import { generateNextId } from "@/lib/id-utils";
import {
  calcGrade,
  calcMaxMarks,
  calcPercentage,
  calcTotalMarks,
  type ResultRecord,
  type ResultSubject,
} from "@/lib/result-utils";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";

const DEFAULT_SUBJECTS: ResultSubject[] = [
  { subject: "Mathematics", maxMarks: 100, marks: 0 },
  { subject: "English", maxMarks: 100, marks: 0 },
  { subject: "Science", maxMarks: 100, marks: 0 },
];

function emptyResult(): ResultRecord {
  return {
    id: "",
    examId: "",
    examName: "",
    studentId: "",
    studentName: "",
    class: "",
    subjects: DEFAULT_SUBJECTS.map((s) => ({ ...s })),
  };
}

export function ResultsPageContent() {
  const { items, loading, error, create, update, remove } = useResource<ResultRecord>("results");
  const { items: exams } = useResource<{ id: string; name: string; class: string }>("exams");
  const { items: students } = useResource<{ id: string; name: string; class: string }>("students");

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ResultRecord | null>(null);
  const [form, setForm] = useState<ResultRecord>(emptyResult());
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter(
      (r) =>
        !q ||
        r.studentName.toLowerCase().includes(q) ||
        r.studentId.toLowerCase().includes(q) ||
        r.examName.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
    );
  }, [items, search]);

  const pct = calcPercentage(form.subjects);
  const grade = calcGrade(pct);

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyResult(), id: generateNextId("RES", items.map((r) => r.id)) });
    setFormError("");
    setFormOpen(true);
  }

  function openEdit(row: ResultRecord) {
    setEditing(row);
    setForm({ ...row, subjects: row.subjects.map((s) => ({ ...s })) });
    setFormError("");
    setFormOpen(true);
  }

  function handleExamChange(examId: string | null) {
    if (!examId) return;
    const exam = exams.find((e) => e.id === examId);
    setForm({
      ...form,
      examId,
      examName: exam?.name ?? "",
      class: exam?.class ?? form.class,
    });
  }

  function handleStudentChange(studentId: string | null) {
    if (!studentId) return;
    const student = students.find((s) => s.id === studentId);
    setForm({
      ...form,
      studentId,
      studentName: student?.name ?? "",
      class: student?.class ?? form.class,
    });
  }

  function updateSubject(index: number, patch: Partial<ResultSubject>) {
    setForm({
      ...form,
      subjects: form.subjects.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    });
  }

  function addSubject() {
    setForm({
      ...form,
      subjects: [...form.subjects, { subject: "", maxMarks: 100, marks: 0 }],
    });
  }

  function removeSubject(index: number) {
    setForm({ ...form, subjects: form.subjects.filter((_, i) => i !== index) });
  }

  async function handleSubmit() {
    if (!form.examId || !form.studentId) {
      setFormError("Please select an exam and student.");
      return;
    }
    if (form.subjects.length === 0) {
      setFormError("Add at least one subject.");
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

  async function handleDelete(row: ResultRecord) {
    if (!confirm(`Delete result for ${row.studentName}?`)) return;
    await remove(row.id);
  }

  const columns = [
    { key: "examName", label: "Exam" },
    { key: "studentName", label: "Student" },
    { key: "class", label: "Class" },
    {
      key: "subjects",
      label: "Subjects",
      render: (row: ResultRecord) => (
        <div className="space-y-0.5 text-xs">
          {row.subjects.map((s) => (
            <div key={s.subject}>
              {s.subject}: {s.marks}/{s.maxMarks}
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "percentage",
      label: "Percentage",
      render: (row: ResultRecord) => `${calcPercentage(row.subjects)}%`,
    },
    {
      key: "grade",
      label: "Grade",
      render: (row: ResultRecord) => (
        <Badge variant="default">{calcGrade(calcPercentage(row.subjects))}</Badge>
      ),
    },
    { key: "id", label: "Result ID" },
    {
      key: "actions",
      label: "Actions",
      render: (row: ResultRecord) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleDelete(row)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminHeader title="Results" />
      <div className="p-4 pb-8 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {loading ? <AdminLoadingText label="Loading results..." /> : `${items.length} results`}
          </p>
          <Button size="sm" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Result
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

        {loading && filtered.length === 0 ? (
          <AdminPageLoading label="Loading results..." />
        ) : filtered.length > 0 ? (
          <AdminDataTable columns={columns} data={filtered} />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
              <p className="mb-4 text-sm text-muted-foreground">No results found.</p>
              <Button size="sm" onClick={openCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Result
              </Button>
            </div>
        )}
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Result" : "Add Result"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {editing && (
              <div className="space-y-2">
                <Label>Result ID</Label>
                <Input value={form.id} readOnly className="bg-muted" />
              </div>
            )}

            <div className="space-y-2">
              <Label>Exam</Label>
              <Select value={form.examId} onValueChange={handleExamChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exam" />
                </SelectTrigger>
                <SelectContent>
                  {exams.map((exam) => (
                    <SelectItem key={exam.id} value={exam.id}>
                      {exam.name} ({exam.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Student</Label>
              <Select value={form.studentId} onValueChange={handleStudentChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} — {student.class}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Class</Label>
              <Input value={form.class} readOnly className="bg-muted" />
            </div>

            <div className="space-y-3">
              <Label>Subject Marks</Label>
              {form.subjects.map((subject, i) => (
                <ListItemCard
                  key={i}
                  title={subject.subject || `Subject ${i + 1}`}
                  onRemove={() => removeSubject(i)}
                >
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Subject</Label>
                      <Input
                        value={subject.subject}
                        onChange={(e) => updateSubject(i, { subject: e.target.value })}
                        placeholder="Math"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Max Marks</Label>
                      <Input
                        type="number"
                        value={subject.maxMarks}
                        onChange={(e) =>
                          updateSubject(i, { maxMarks: Number(e.target.value) })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Marks Obtained</Label>
                      <Input
                        type="number"
                        value={subject.marks}
                        onChange={(e) => updateSubject(i, { marks: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </ListItemCard>
              ))}
              <AddItemButton label="Add Subject" onClick={addSubject} />
            </div>

            <div className="rounded-lg border bg-muted/40 p-4">
              <p className="text-sm font-medium">Total</p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Marks: </span>
                  {calcTotalMarks(form.subjects)}/{calcMaxMarks(form.subjects)}
                </div>
                <div>
                  <span className="text-muted-foreground">Percentage: </span>
                  {pct}%
                </div>
                <div>
                  <span className="text-muted-foreground">Grade: </span>
                  <Badge variant="default">{grade}</Badge>
                </div>
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
    </>
  );
}
