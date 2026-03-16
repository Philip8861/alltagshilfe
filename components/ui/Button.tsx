import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  className?: string;
};

export function Button({
  variant = "primary",
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        variant === "primary" &&
          "bg-neutral-900 text-white hover:bg-neutral-800 focus:ring-neutral-900",
        variant === "secondary" &&
          "border border-[#0F4F68]/25 bg-white text-neutral-900 hover:bg-neutral-50 focus:ring-1 focus:ring-[#0F4F68]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
