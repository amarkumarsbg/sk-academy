"use client";

import Image, { type ImageProps } from "next/image";

type ContentImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

export function ContentImage({ src, alt, ...props }: ContentImageProps) {
  const isDataUrl = src.startsWith("data:");

  return <Image src={src} alt={alt} unoptimized={isDataUrl} {...props} />;
}
