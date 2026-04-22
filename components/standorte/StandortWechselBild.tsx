"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const BILDER = ["/images/standort_gemeinsam.webp", "/images/einkaufen.webp"];

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
    <div className="relative aspect-[1301/1535] w-full rounded-xl">
      {BILDER.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          draggable={false}
          className={
            "rounded-xl object-cover object-center [filter:drop-shadow(0_10px_22px_rgba(15,79,104,0.2))_drop-shadow(0_4px_12px_rgba(15,79,104,0.12))] [will-change:filter] transition-opacity duration-1000 ease-out motion-reduce:transition-none " +
            (i === index ? "opacity-100" : "opacity-0")
          }
          sizes={sizes}
          priority={i === 0}
        />
      ))}
    </div>
  );
}

