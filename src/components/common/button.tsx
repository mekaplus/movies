import * as React from "react"
import { cn } from "@/lib/utils"

const buttonVariants = {
  variant: {
    default: "btn bg-white text-black",
    destructive: "btn bg-red-600 text-white hover:bg-red-700",
    outline: "btn border border-gray-300 bg-transparent",
    secondary: "btn bg-gray-600 text-white hover:bg-gray-700",
    ghost: "btn-ghost",
    link: "btn text-blue-600",
    xflix: "btn-xflix",
    xflixOutline: "btn-xflix-outline",
  },
  size: {
    default: "px-4 py-2",
    sm: "px-3 py-1 text-sm",
    lg: "btn-lg",
    icon: "btn-icon",
  },
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant
  size?: keyof typeof buttonVariants.size
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantClass = buttonVariants.variant[variant]
    const sizeClass = buttonVariants.size[size]
    const baseClass = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 disabled:pointer-events-none disabled:opacity-50"

    return (
      <button
        className={cn(baseClass, variantClass, sizeClass, className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }