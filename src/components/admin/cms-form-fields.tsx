"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, Trash2, Upload } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-shell";
import { EditorNote, SaveButton } from "@/components/admin/content-editor";
import { ContentImage } from "@/components/public/content-image";
import { readImageAsDataUrl } from "@/lib/read-image-file";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CmsPageShell({
  title,
  onSave,
  children,
}: {
  title: string;
  onSave: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminHeader title={title} />
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <Link
          href="/admin/cms"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to CMS
        </Link>
        <EditorNote />
        <div className="mx-auto max-w-3xl space-y-6">{children}</div>
        <div className="mx-auto mt-8 flex max-w-3xl justify-end">
          <SaveButton onSave={onSave} />
        </div>
      </div>
    </>
  );
}

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
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
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function ListItemCard({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium">{title}</p>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function AddItemButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick}>
      + {label}
    </Button>
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

  const handleFile = async (file: File) => {
    setError(null);
    setLoading(true);
    try {
      const dataUrl = await readImageAsDataUrl(file);
      onChange(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {value ? (
        <div className={`relative w-full overflow-hidden rounded-md border bg-muted ${previewClassName}`}>
          <ContentImage src={value} alt="Preview" fill className="object-cover" />
        </div>
      ) : (
        <div
          className={`flex w-full items-center justify-center rounded-md border border-dashed bg-muted/40 text-xs text-muted-foreground ${previewClassName}`}
        >
          No image selected
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="mr-1 h-4 w-4" />
          {loading ? "Uploading…" : "Upload image"}
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
            Remove
          </Button>
        )}
      </div>

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

      <Field
        label="Or paste image URL"
        value={value.startsWith("data:") ? "" : value}
        onChange={onChange}
        placeholder="https://images.unsplash.com/..."
      />

      <p className="text-xs text-muted-foreground">JPG, PNG, WebP, or GIF · max 2 MB</p>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
