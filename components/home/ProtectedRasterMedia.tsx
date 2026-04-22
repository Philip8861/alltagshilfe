"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Erschwert das unmittelbare Kopieren/Speichern per Rechtsklick und Drag.
 * Kein vollständiger Schutz (Assets sind im Netzwerk sichtbar); nur übliche Abschreckung.
 */
export function ProtectedRasterMedia({ children, className = "" }: Props) {
  return (
    <div
      className={className}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      {children}
    </div>
  );
}
