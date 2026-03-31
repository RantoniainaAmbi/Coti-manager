import React from "react"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

type StatVariant = "success" | "danger" | "info" | "warning" | "default"

type StatCardProps = {
  label: string
  value: string | number
  icon?: React.ReactNode
  variant?: StatVariant 
  change?: number 
}

export default function StatCard({
  label,
  value,
  icon,
  variant = "default",
  change,
}: StatCardProps) {
  
  const variantStyles = {
    success: "text-emerald-400", 
    danger: "text-rose-400",    
    info: "text-violet-400",    
    warning: "text-amber-400",  
    default: "text-white"       
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span className="font-medium">{label}</span>
        {icon && <span className="text-gray-500 opacity-80">{icon}</span>}
      </div>

      {/* Value */}
      <div className="mt-3 flex items-end justify-between">
        <p className={`text-2xl font-bold tracking-tight ${variantStyles[variant]}`}>
          {value}
        </p>

        {/* Change indicator (Optionnel) */}
        {typeof change === "number" && (
          <div
            className={`flex items-center gap-1 text-xs font-medium ${
              change >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
    </div>
  )
}