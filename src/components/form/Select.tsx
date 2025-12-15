"use client"
import { Select as AntSelect, type SelectProps as AntSelectProps } from "antd"

interface SelectProps extends AntSelectProps {
  label?: string
  required?: boolean
  error?: string
}

export function CustomSelect({ label, required, error, className, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <AntSelect
        className={`w-full ${error ? "border-red-500" : ""}`}
        status={error ? "error" : undefined}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}
