import * as React from "react";

const cx = (...classes: Array<string | undefined | false | null>) => classes.filter(Boolean).join(" ");

type Variant = "default" | "success" | "warning" | "danger";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

const variantClass: Record<Variant, string> = {
  default:
    "border-[var(--fk-border,#e5e7eb)] bg-[color:var(--fk-surface,#f9fafb)] text-[color:var(--fk-text,#111827)]",
  success:
    "border-[color:rgba(16,185,129,.25)] bg-[color:rgba(16,185,129,.12)] text-[color:rgba(5,150,105,1)]",
  warning:
    "border-[color:rgba(245,158,11,.25)] bg-[color:rgba(245,158,11,.12)] text-[color:rgba(217,119,6,1)]",
  danger:
    "border-[color:rgba(239,68,68,.25)] bg-[color:rgba(239,68,68,.12)] text-[color:rgba(220,38,38,1)]",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variantClass[variant],
        className
      )}
      {...props}
    />
  );
}
