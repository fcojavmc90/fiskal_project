import * as React from "react";

const cx = (...classes: Array<string | undefined | false | null>) => classes.filter(Boolean).join(" ");

type Variant = "default" | "success" | "warning" | "danger";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
}

const variantClass: Record<Variant, string> = {
  default:
    "border-[var(--fk-border,#e5e7eb)] bg-[color:var(--fk-surface,#f9fafb)] text-[color:var(--fk-text,#111827)]",
  success:
    "border-[color:rgba(16,185,129,.25)] bg-[color:rgba(16,185,129,.10)] text-[color:var(--fk-text,#111827)]",
  warning:
    "border-[color:rgba(245,158,11,.25)] bg-[color:rgba(245,158,11,.10)] text-[color:var(--fk-text,#111827)]",
  danger:
    "border-[color:rgba(239,68,68,.25)] bg-[color:rgba(239,68,68,.10)] text-[color:var(--fk-text,#111827)]",
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cx("relative w-full rounded-xl border p-4", variantClass[variant], className)}
    {...props}
  />
));
Alert.displayName = "Alert";

export const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cx("mb-1 font-semibold leading-none tracking-tight", className)} {...props} />
  )
);
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx("text-sm text-[color:var(--fk-muted,#6b7280)]", className)} {...props} />
  )
);
AlertDescription.displayName = "AlertDescription";
