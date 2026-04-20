"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductImageGallery({ images, productName }: { images: string[], productName: string }) {
  const [activeImage, setActiveImage] = useState(images[0] || "https://picsum.photos/seed/detail/800/800");

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
        <Image
          src={activeImage}
          alt={productName}
          fill
          className="object-contain p-4"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((src) => (
            <button
              key={src}
              onClick={() => setActiveImage(src)}
              className={`relative aspect-square overflow-hidden rounded-lg bg-slate-100 transition hover:opacity-80 p-1 ${
                activeImage === src ? "ring-2 ring-amber-500" : ""
              }`}
            >
              <Image src={src} alt="" fill className="object-contain" sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
