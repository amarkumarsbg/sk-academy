"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function SaveButton({
  onSave,
  label = "Save Changes",
  saving = false,
}: {
  onSave: () => void | Promise<void>;
  label?: string;
  saving?: boolean;
}) {
  const [saved, setSaved] = useState(false);

  return (
    <Button
      type="button"
      disabled={saving}
      onClick={async () => {
        await onSave();
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }}
    >
      {saving ? (
        "Saving..."
      ) : saved ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Saved
        </>
      ) : (
        label
      )}
    </Button>
  );
}

export function EditorNote() {
  return (
    <p className="mb-6 rounded-lg border border-dashed bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
      Changes are saved to the database and appear on the public website immediately after saving.
      Uploaded images are stored on the server (max 5 MB each).
    </p>
  );
}
