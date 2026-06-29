"use client";

import { useMemo, useState } from "react";
import { AdminLoadingText, AdminPageLoading } from "@/components/admin/admin-loading";
import { AdminHeader } from "@/components/admin/admin-shell";
import { AdminDataTable } from "@/components/admin/admin-data-table";
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
import { Pencil, Plus, Search, Trash2 } from "lucide-react";

export interface FieldConfig {
  key: string;
  label: string;
  type?: "text" | "number" | "date" | "select" | "readonly";
  options?: string[];
  placeholder?: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: string[];
  allLabel?: string;
}

interface ResourceCrudPageProps<T extends { id: string }> {
  title: string;
  resource: string;
  fields: FieldConfig[];
  columns: {
    key: keyof T | string;
    label: string;
    render?: (row: T) => React.ReactNode;
    primary?: boolean;
    hideOnMobile?: boolean;
  }[];
  emptyItem: T;
  /** ID prefix for auto-generation, e.g. "TCH" → TCH001 */
  idPrefix?: string;
  searchKeys?: (keyof T | string)[];
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  emptyStateMessage?: string;
  addLabel?: string;
  /** Hide ID field entirely on create; show readonly on edit */
  autoId?: boolean;
}

export function ResourceCrudPage<T extends { id: string }>({
  title,
  resource,
  fields,
  columns,
  emptyItem,
  idPrefix,
  searchKeys = [],
  searchPlaceholder = "Search...",
  filters = [],
  emptyStateMessage,
  addLabel = "Add",
  autoId = Boolean(idPrefix),
}: ResourceCrudPageProps<T>) {
  const { items, loading, error, create, update, remove } = useResource<T>(resource);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [form, setForm] = useState<T>(emptyItem);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(filters.map((f) => [f.key, "All"]))
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch =
        !q ||
        searchKeys.some((key) =>
          String(item[key as keyof T] ?? "")
            .toLowerCase()
            .includes(q)
        );
      const matchesFilters = filters.every((filter) => {
        const value = filterValues[filter.key] ?? "All";
        if (value === "All") return true;
        return String(item[filter.key as keyof T] ?? "") === value;
      });
      return matchesSearch && matchesFilters;
    });
  }, [items, search, searchKeys, filters, filterValues]);

  function nextId(): string {
    if (idPrefix) {
      return generateNextId(idPrefix, items.map((i) => i.id));
    }
    return `${resource.toUpperCase().slice(0, 3)}${Date.now()}`;
  }

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyItem, id: nextId() } as T);
    setFormError("");
    setOpen(true);
  }

  function openEdit(item: T) {
    setEditing(item);
    setForm(item);
    setFormError("");
    setOpen(true);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setFormError("");
    try {
      if (editing) {
        await update(editing.id, form);
      } else {
        await create(form);
      }
      setOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(item: T) {
    if (!confirm(`Delete ${item.id}?`)) return;
    await remove(item.id);
  }

  const visibleFields = fields.filter((field) => {
    if (field.key === "id" && autoId) return false;
    return true;
  });

  const tableColumns = [
    ...columns,
    {
      key: "actions",
      label: "Actions",
      render: (row: T) => (
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

  const emptyMessage =
    emptyStateMessage ??
    (search || filters.some((f) => filterValues[f.key] !== "All")
      ? `No ${title.toLowerCase()} match your search or filters.`
      : `No ${title.toLowerCase()} records found.`);

  return (
    <>
      <AdminHeader title={title} />
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {loading ? <AdminLoadingText /> : `${items.length} records`}
          </p>
          <Button size="sm" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            {addLabel}
          </Button>
        </div>

        {(searchKeys.length > 0 || filters.length > 0) && (
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
            {searchKeys.length > 0 && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            )}
            {filters.length > 0 && (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
                {filters.map((filter) => (
                  <Select
                    key={filter.key}
                    value={filterValues[filter.key] ?? "All"}
                    onValueChange={(v) =>
                      setFilterValues((prev) => ({ ...prev, [filter.key]: v ?? "All" }))
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder={filter.label} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">{filter.allLabel ?? `All ${filter.label}`}</SelectItem>
                      {filter.options.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ))}
              </div>
            )}
          </div>
        )}

        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

        {loading && filtered.length === 0 ? (
          <AdminPageLoading label={`Loading ${title.toLowerCase()}...`} />
        ) : filtered.length > 0 ? (
          <AdminDataTable columns={tableColumns} data={filtered} />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
              <p className="mb-4 text-sm text-muted-foreground">{emptyMessage}</p>
              <Button size="sm" onClick={openCreate}>
                <Plus className="mr-2 h-4 w-4" />
                {addLabel}
              </Button>
            </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit" : "Add"} {title.replace(/s$/, "")}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {autoId && editing && (
                <div className="space-y-2">
                  <Label>ID</Label>
                  <Input value={form.id} readOnly className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Auto-generated (read only)</p>
                </div>
              )}
              {visibleFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  {field.type === "select" && field.options ? (
                    <Select
                      value={String(form[field.key as keyof T] ?? "")}
                      onValueChange={(v) =>
                        setForm({ ...form, [field.key]: v ?? "" } as T)
                      }
                    >
                      <SelectTrigger id={field.key}>
                        <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={field.key}
                      type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                      readOnly={field.type === "readonly"}
                      className={field.type === "readonly" ? "bg-muted" : undefined}
                      placeholder={field.placeholder}
                      value={String(form[field.key as keyof T] ?? "")}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [field.key]:
                            field.type === "number" ? Number(e.target.value) : e.target.value,
                        } as T)
                      }
                    />
                  )}
                </div>
              ))}
              {formError && <p className="text-sm text-destructive">{formError}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export function statusBadge(status: string) {
  if (status === "Paid" || status === "Approved" || status === "Active" || status === "Present")
    return <Badge variant="default">{status}</Badge>;
  if (status === "Partial" || status === "Late" || status === "Scheduled")
    return <Badge variant="secondary">{status}</Badge>;
  if (status === "Pending" || status === "Absent")
    return <Badge variant="outline">{status}</Badge>;
  if (status === "Rejected")
    return <Badge variant="destructive">{status}</Badge>;
  return <Badge variant="secondary">{status}</Badge>;
}
