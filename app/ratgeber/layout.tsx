import type { ReactNode } from "react";

import { RatgeberBeratungProvider } from "@/components/ratgeber/RatgeberBeratungDialog";

export default function RatgeberLayout({ children }: { children: ReactNode }) {
  return <RatgeberBeratungProvider>{children}</RatgeberBeratungProvider>;
}
