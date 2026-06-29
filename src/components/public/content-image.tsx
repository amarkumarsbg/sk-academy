"use client";

import Image, { type ImageProps } from "next/image";

type ContentImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

export function ContentImage({ src, alt, ...props }: ContentImageProps) {
  if (!src) return null;

  const isDataUrl = src.startsWith("data:");
  const isBlobUrl = src.startsWith("blob:");
  const isLocalAsset = src.startsWith("/");

  return (
    <Image
      src={src}
      alt={alt}
      unoptimized={isDataUrl || isBlobUrl || isLocalAsset}
      {...props}
    />
  );
}
