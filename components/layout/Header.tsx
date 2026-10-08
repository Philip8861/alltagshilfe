import { HeaderMainRow } from "./HeaderMainRow";
import { HeaderStrip } from "./HeaderStrip";

export function Header() {
  return (
    <header className="sticky top-0 z-[100] overflow-visible shadow-[0_4px_6px_-1px_rgb(0_0_0/0.07),0_2px_4px_-2px_rgb(0_0_0/0.07)]">
      <HeaderStrip />
      <HeaderMainRow />
    </header>
  );
}
