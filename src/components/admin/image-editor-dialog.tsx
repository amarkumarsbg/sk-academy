"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { AdminButtonSpinner } from "@/components/admin/admin-loading";
import { ContentImage } from "@/components/public/content-image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  blobToFile,
  defaultImageAdjustments,
  getEditedImageBlob,
  type ImageAdjustments,
} from "@/lib/image-editor";
import { cn } from "@/lib/utils";

type ImageEditorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string | null;
  aspect?: number;
  previewClassName?: string;
  onApply: (file: File) => Promise<void>;
  onClose?: () => void;
};

function AdjustmentSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <Label>{label}</Label>
        <span className="text-muted-foreground">{value}</span>
      </div>
      <input
        type="range"
        min={-50}
        max={50}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer accent-primary"
      />
    </div>
  );
}

export function ImageEditorDialog({
  open,
  onOpenChange,
  imageSrc,
  aspect = 16 / 9,
  previewClassName = "aspect-video",
  onApply,
  onClose,
}: ImageEditorDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [adjustments, setAdjustments] = useState<ImageAdjustments>(defaultImageAdjustments);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetEditor = useCallback(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setAdjustments(defaultImageAdjustments);
    setPreviewUrl(null);
    setError(null);
  }, []);

  useEffect(() => {
    if (!open) {
      resetEditor();
      return;
    }
    resetEditor();
  }, [open, imageSrc, resetEditor]);

  const updatePreview = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setPreviewLoading(true);
    setError(null);

    try {
      const blob = await getEditedImageBlob(imageSrc, croppedAreaPixels, adjustments);
      const nextUrl = URL.createObjectURL(blob);
      setPreviewUrl((current) => {
        if (current?.startsWith("blob:")) URL.revokeObjectURL(current);
        return nextUrl;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Preview failed.");
    } finally {
      setPreviewLoading(false);
    }
  }, [adjustments, croppedAreaPixels, imageSrc]);

  useEffect(() => {
    if (!open || !imageSrc || !croppedAreaPixels) return;

    const timer = window.setTimeout(() => {
      void updatePreview();
    }, 200);

    return () => window.clearTimeout(timer);
  }, [open, imageSrc, croppedAreaPixels, adjustments, updatePreview]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const canApply = Boolean(imageSrc && croppedAreaPixels && !applying);

  const handleApply = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setApplying(true);
    setError(null);

    try {
      const blob = await getEditedImageBlob(imageSrc, croppedAreaPixels, adjustments);
      const file = blobToFile(blob, `edited-${Date.now()}.jpg`);
      await onApply(file);
      onOpenChange(false);
      onClose?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save image.");
    } finally {
      setApplying(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) onClose?.();
    onOpenChange(nextOpen);
  };

  const previewLabel = useMemo(() => {
    if (aspect === 1) return "Square preview";
    if (Math.abs(aspect - 16 / 9) < 0.01) return "Banner preview";
    return "Site preview";
  }, [aspect]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl" showCloseButton={!applying}>
        <DialogHeader>
          <DialogTitle>Adjust image</DialogTitle>
          <DialogDescription>
            Crop, brighten, and preview how this image will appear on the live site before uploading.
          </DialogDescription>
        </DialogHeader>

        {imageSrc ? (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div className="space-y-4">
              <div className="relative h-64 overflow-hidden rounded-lg border bg-muted sm:h-72">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
                />
              </div>

              <div className="space-y-3">
                <AdjustmentSlider
                  label="Zoom"
                  value={Math.round((zoom - 1) * 100)}
                  onChange={(value) => setZoom(1 + value / 100)}
                />
                <AdjustmentSlider
                  label="Brightness"
                  value={adjustments.brightness}
                  onChange={(brightness) => setAdjustments((prev) => ({ ...prev, brightness }))}
                />
                <AdjustmentSlider
                  label="Contrast"
                  value={adjustments.contrast}
                  onChange={(contrast) => setAdjustments((prev) => ({ ...prev, contrast }))}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">{previewLabel}</p>
                <p className="text-xs text-muted-foreground">
                  This is how the image will look after you apply changes.
                </p>
              </div>

              <div
                className={cn(
                  "relative overflow-hidden rounded-lg border bg-muted",
                  previewClassName,
                  "min-h-40 w-full"
                )}
              >
                {previewLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 text-xs text-muted-foreground">
                    Updating preview…
                  </div>
                )}
                {previewUrl ? (
                  <ContentImage src={previewUrl} alt="Edited preview" fill className="object-cover" unoptimized />
                ) : (
                  <div className="flex h-full min-h-40 items-center justify-center px-4 text-center text-xs text-muted-foreground">
                    Move or zoom the crop area to generate a preview.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button type="button" variant="outline" disabled={applying} onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" disabled={!canApply} onClick={() => void handleApply()}>
            {applying ? (
              <>
                <AdminButtonSpinner label="Uploading" />
                Uploading…
              </>
            ) : (
              "Apply & upload"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
