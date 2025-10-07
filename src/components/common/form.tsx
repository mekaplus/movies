import React from "react"
import { ChevronDown } from "./icons"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  required?: boolean
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  required?: boolean
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, className, ...props }, ref) => {
    const baseClassName = "w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base"
    const errorClassName = error ? "border-red-400 focus:ring-red-400 focus:border-red-400" : ""

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-red-400 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`${baseClassName} ${errorClassName} ${className || ""}`}
          {...props}
        />
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, required, className, children, ...props }, ref) => {
    const baseClassName = "w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base appearance-none"
    const errorClassName = error ? "border-red-400 focus:ring-red-400 focus:border-red-400" : ""

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-red-400 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`${baseClassName} ${errorClassName} ${className || ""}`}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = "Select"

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            className={`w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 bg-white transition-colors ${className || ""}`}
            {...props}
          />
          {label && (
            <span className="text-red-400 font-medium">{label}</span>
          )}
        </label>
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
    )
  }
)

Checkbox.displayName = "Checkbox"

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, required, className, ...props }, ref) => {
    const baseClassName = "w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base resize-y"
    const errorClassName = error ? "border-red-400 focus:ring-red-400 focus:border-red-400" : ""

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-red-400 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`${baseClassName} ${errorClassName} ${className || ""}`}
          {...props}
        />
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = "Textarea"

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    const baseClassName = "font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

    const variants = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
      secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
      outline: "bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-900 focus:ring-gray-500"
    }

    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-6 py-4 text-lg"
    }

    return (
      <button
        ref={ref}
        className={`${baseClassName} ${variants[variant]} ${sizes[size]} ${className || ""}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"