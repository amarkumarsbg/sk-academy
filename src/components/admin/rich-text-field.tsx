"use client";

import { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Bold, Italic, Link, List, ListOrdered } from "lucide-react";

export function RichTextField({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = useCallback((command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    editorRef.current?.focus();
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const addLink = () => {
    const url = prompt("Enter URL:");
    if (url) exec("createLink", url);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="overflow-hidden rounded-md border">
        <div className="flex flex-wrap gap-1 border-b bg-muted/40 p-1">
          <Button type="button" size="sm" variant="ghost" onClick={() => exec("bold")} aria-label="Bold">
            <Bold className="h-4 w-4" />
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => exec("italic")} aria-label="Italic">
            <Italic className="h-4 w-4" />
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => exec("insertUnorderedList")} aria-label="Bullet list">
            <List className="h-4 w-4" />
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => exec("insertOrderedList")} aria-label="Numbered list">
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={addLink} aria-label="Insert link">
            <Link className="h-4 w-4" />
          </Button>
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="min-h-[calc(var(--rows)*1.5rem)] px-3 py-2 text-sm outline-none"
          style={{ "--rows": rows } as React.CSSProperties}
          dangerouslySetInnerHTML={{ __html: value }}
          onInput={handleInput}
        />
      </div>
    </div>
  );
}

export function RichTextPreview({ html, title }: { html: string; title: string }) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div
        className="prose prose-sm max-w-none text-muted-foreground [&_a]:text-primary [&_a]:underline"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
