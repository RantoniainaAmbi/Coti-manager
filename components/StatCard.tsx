import React from "react"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

type StatCardHighlight = "positive" | "negative"

type StatCardProps = {
  label: string
  value: string | number
  icon?: React.ReactNode
  highlight?: StatCardHighlight
  change?: number // optionnel (% évolution)
}

export default function StatCard({
  label,
  value,
  icon,
  highlight,
  change,
}: StatCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition">

      {/* Header */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>{label}</span>
        {icon && <span className="text-gray-500">{icon}</span>}
      </div>

      {/* Value */}
      <div className="mt-3 flex items-end justify-between">
        <p
          className={`text-2xl font-semibold ${
            highlight === "positive"
              ? "text-green-400"
              : highlight === "negative"
              ? "text-red-400"
              : "text-white"
          }`}
        >
          {value}
        </p>

        {/* Change indicator */}
        {typeof change === "number" && (
          <div
            className={`flex items-center gap-1 text-xs ${
              change >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {change >= 0 ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>
    </div>
  )
}