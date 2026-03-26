import { Period } from "./types"

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
]

interface PeriodListProps {
  periods: Period[]
  selectedPeriod: Period | null
  onSelectPeriod: (period: Period) => void
}

export default function PeriodList({ periods, selectedPeriod, onSelectPeriod }: PeriodListProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-2">
      <p className="text-xs text-gray-500 uppercase">Périodes</p>

      {periods.map((p) => {
        const paid = p.contributions.filter(c => c.status === "PAID").length
        const total = p.contributions.length

        return (
          <button
            key={p.id}
            onClick={() => onSelectPeriod(p)}
            className={`w-full text-left p-3 rounded-lg transition ${
              selectedPeriod?.id === p.id
                ? "bg-violet-600/20 border border-violet-500"
                : "hover:bg-gray-800"
            }`}
          >
            <p className="text-sm font-medium">
              {MONTHS[p.month - 1]} {p.year}
            </p>
            <p className="text-xs text-gray-400">
              {paid}/{total} payés · {p.amount.toLocaleString()} Ar
            </p>
          </button>
        )
      })}
    </div>
  )
}