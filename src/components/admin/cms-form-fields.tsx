"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ChevronDown, Trash2, Upload } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-shell";
import { markCmsSectionSaved, useCmsToast } from "@/components/admin/cms-toast";
import { ContentImage } from "@/components/public/content-image";
import { useSiteContent } from "@/context/site-content-provider";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { readImageAsDataUrl } from "@/lib/read-image-file";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function CmsStickyFooter({
  isDirty,
  saving,
  lastSavedAt,
  onSave,
  onCancel,
}: {
  isDirty: boolean;
  saving: boolean;
  lastSavedAt?: Date | null;
  onSave: () => void | Promise<void>;
  onCancel?: () => void;
}) {
  return (
    <div className="sticky bottom-0 z-20 border-t bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm">
          {isDirty ? (
            <span className="flex items-center gap-2 font-medium text-amber-700">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
              Unsaved changes
            </span>
          ) : lastSavedAt ? (
            <span className="text-muted-foreground">Last saved: {formatRelativeTime(lastSavedAt)}</span>
          ) : (
            <span className="text-muted-foreground">All changes saved</span>
          )}
        </div>
        <div className="flex gap-2">
          {onCancel && (
            <Button type="button" variant="outline" disabled={!isDirty || saving} onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="button" disabled={!isDirty || saving} onClick={() => void onSave()}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CmsPageShell({
  title,
  onSave,
  saving = false,
  isDirty = false,
  onCancel,
  storageKey,
  previewHref,
  children,
}: {
  title: string;
  onSave: () => void | Promise<void>;
  saving?: boolean;
  isDirty?: boolean;
  onCancel?: () => void;
  storageKey?: string;
  previewHref?: string;
  children: ReactNode;
}) {
  const { showToast } = useCmsToast();
  const { lastSavedAt } = useSiteContent();

  async function handleSave() {
    await onSave();
    if (storageKey) markCmsSectionSaved(storageKey);
    showToast("Changes saved successfully");
  }

  return (
    <>
      <AdminHeader title={title} />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto p-4 pb-28 sm:p-6 sm:pb-28">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <Link
              href="/admin/cms"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to CMS
            </Link>
            {previewHref && (
              <Link
                href={previewHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Preview page ↗
              </Link>
            )}
          </div>
          <div className="mx-auto max-w-3xl space-y-4">{children}</div>
        </div>
        <CmsStickyFooter
          isDirty={isDirty}
          saving={saving}
          lastSavedAt={lastSavedAt}
          onSave={handleSave}
          onCancel={onCancel}
        />
      </div>
    </>
  );
}

export function CmsAccordionSection({
  title,
  description,
  defaultOpen = false,
  children,
}: {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card>
      <button
        type="button"
        className="flex w-full items-start justify-between gap-3 px-6 py-4 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <div>
          <p className="text-base font-semibold">{title}</p>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        <ChevronDown className={cn("mt-1 h-4 w-4 shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && <CardContent className="space-y-4 border-t pt-4">{children}</CardContent>}
    </Card>
  );
}

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  readOnly,
}: {
  label: string;
  value: string | number;
  onChange?: (value: string) => void;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        className={readOnly ? "bg-muted" : undefined}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      />
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  maxLength?: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        {maxLength && (
          <span className="text-xs text-muted-foreground">
            {value.length} / {maxLength}
          </span>
        )}
      </div>
      <Textarea
        rows={rows}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function ListItemCard({
  title,
  onRemove,
  deleteLabel,
  children,
}: {
  title: string;
  onRemove: () => void;
  deleteLabel?: string;
  children: ReactNode;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <div className="rounded-lg border p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium">{title}</p>
          <Button type="button" variant="ghost" size="sm" onClick={() => setConfirmOpen(true)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
        <div className="space-y-3">{children}</div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete {title}?</DialogTitle>
            <DialogDescription>
              {deleteLabel ?? `Are you sure you want to delete "${title}"? This cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onRemove();
                setConfirmOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function AddItemButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick}>
      + {label}
    </Button>
  );
}

export function EmptyState({ message, actionLabel, onAction }: { message: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <div className="rounded-lg border border-dashed px-4 py-8 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
      {actionLabel && onAction && (
        <Button type="button" variant="outline" size="sm" className="mt-3" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ImageUploadField({
  label,
  value,
  onChange,
  previewClassName = "aspect-video max-h-44",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  previewClassName?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File) => {
    setError(null);
    setLoading(true);
    try {
      const url = await readImageAsDataUrl(file, { maxSizeMB: 5 });
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const openFilePicker = () => {
    if (!loading) inputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <button
        type="button"
        disabled={loading}
        className={cn(
          "relative block w-full overflow-hidden rounded-md border bg-muted text-left transition-colors",
          previewClassName,
          dragOver && "border-primary ring-2 ring-primary/20",
          !loading && "cursor-pointer hover:border-primary/50"
        )}
        onClick={openFilePicker}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void handleFile(file);
        }}
      >
        {value ? (
          <>
            <ContentImage src={value} alt="Preview" fill className="object-cover" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-xs font-medium text-white opacity-0 transition hover:bg-black/40 hover:opacity-100">
              {loading ? "Uploading…" : "Click or drop to replace"}
            </span>
          </>
        ) : (
          <span className="flex h-full min-h-24 w-full flex-col items-center justify-center gap-2 p-4 text-center text-xs text-muted-foreground">
            <Upload className="h-5 w-5" />
            <span>{loading ? "Uploading…" : "Drag & drop image here"}</span>
            {!loading && <span>or click to browse</span>}
          </span>
        )}
      </button>

      {value && (
        <Button type="button" variant="ghost" size="sm" disabled={loading} onClick={() => onChange("")}>
          Remove
        </Button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />

      <p className="text-xs text-muted-foreground">JPG, PNG, WebP, or GIF · max 5 MB</p>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}