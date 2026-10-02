import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cx } from '@/lib/cx'

const variants = {
  primary: 'bg-blue text-white shadow-[0_10px_24px_rgba(31,107,255,0.22)] hover:bg-[#1857d6]',
  secondary: 'border border-line bg-white text-ink hover:border-blue/30',
  dark: 'bg-navy text-white hover:bg-[#12203a]',
  ghost: 'bg-transparent text-ink hover:bg-white',
}

type Common = {
  children: ReactNode
  variant?: keyof typeof variants
  className?: string
}

type ButtonProps = Common & ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined }
type LinkProps = Common & { to: string }

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps | LinkProps) {
  const classes = cx(
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60',
    variants[variant],
    className,
  )
  if ('to' in props && props.to) {
    return (
      <Link to={props.to} className={classes}>
        {children}
      </Link>
    )
  }
  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  )
}
