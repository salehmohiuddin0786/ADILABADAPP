import React from 'react';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm',
        secondary: 'bg-brand-primary-subtle text-brand-primary hover:bg-emerald-100',
        outline: 'border border-border-default bg-transparent text-content-main hover:bg-surface-muted',
        gold: 'bg-accent-gold text-slate-900 hover:bg-yellow-500 shadow-sm font-bold',
        ghost: 'text-content-main hover:bg-surface-muted',
        danger: 'bg-status-danger text-white hover:bg-red-700 shadow-sm',
        link: 'text-brand-secondary underline-offset-4 hover:underline p-0 h-auto'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-12 rounded-2xl px-6 text-base font-bold',
        icon: 'h-10 w-10 p-0'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';
export { buttonVariants, cn };
export default Button;
