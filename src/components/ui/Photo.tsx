import Image from "next/image";
import type { PhotoAsset } from "../../types/wedding";

interface PhotoProps {
  photo: PhotoAsset;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/** Intrinsic width/height are always passed so the browser reserves space (no layout shift). */
export function Photo({ photo, sizes, priority, className }: PhotoProps) {
  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      sizes={sizes}
      priority={priority}
      className={className}
      style={photo.objectPosition ? { objectPosition: photo.objectPosition } : undefined}
    />
  );
}
