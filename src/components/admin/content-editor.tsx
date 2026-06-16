"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function SaveButton({ onSave, label = "Save Changes" }: { onSave: () => void; label?: string }) {
  const [saved, setSaved] = useState(false);

  return (
    <Button
      type="button"
      onClick={() => {
        onSave();
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }}
    >
      {saved ? (
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
      Changes save locally in your browser and update the public website instantly. Uploaded images are stored in the browser (max 2 MB each). Backend sync will be added later.
    </p>
  );
}
