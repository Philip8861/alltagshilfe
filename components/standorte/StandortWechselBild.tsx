"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const BILDER = ["/images/standort_gemeinsam.webp", "/images/standort_gemeinsam1.webp"];

type StandortWechselBildProps = {
  alt: string;
  sizes: string;
};

/** Wechselt alle 5s mit sanfter Überblendung. */
export function StandortWechselBild({ alt, sizes }: StandortWechselBildProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % BILDER.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative aspect-[1301/1535] w-full overflow-hidden rounded-xl">
      {BILDER.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          className={
            "rounded-xl object-cover object-center transition-opacity duration-1000 ease-out motion-reduce:transition-none " +
            (i === index ? "opacity-100" : "opacity-0")
          }
          sizes={sizes}
          unoptimized
          priority={i === 0}
        />
      ))}
    </div>
  );
}

