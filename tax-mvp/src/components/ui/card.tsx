import * as React from "react";

const cx = (...classes: Array<string | undefined | false | null>) => classes.filter(Boolean).join(" ");

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cx(
        "rounded-xl border border-[var(--fk-border,#e5e7eb)] bg-white text-[var(--fk-text,#111827)] shadow-sm",
        className
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cx("px-6 pt-6 pb-2", className)} {...props} />;
});
CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cx("text-base font-semibold leading-none tracking-tight text-[var(--fk-text,#111827)]", className)}
      {...props}
    />
  );
});
CardTitle.displayName = "CardTitle";

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cx("mt-1 text-sm text-[color:var(--fk-muted,#6b7280)]", className)}
      {...props}
    />
  );
});
CardDescription.displayName = "CardDescription";

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cx("px-6 pb-6", className)} {...props} />;
});
CardContent.displayName = "CardContent";

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cx("px-6 pb-6 pt-2", className)} {...props} />;
});
CardFooter.displayName = "CardFooter";
