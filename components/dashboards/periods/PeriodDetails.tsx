import { Period } from "./types"
import ContributionTable from "./ContributionTable"

interface PeriodDetailsProps {
  period: Period
  onToggleStatus: (id: string, status: string) => void
}

export default function PeriodDetails({ period, onToggleStatus }: PeriodDetailsProps) {
  const paidCount = period.contributions.filter((c) => c.status === "PAID").length
  const totalCount = period.contributions.length
  const totalCollected = paidCount * period.amount
  const totalExpected = totalCount * period.amount

  return (
    <div className="lg:col-span-2 space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-400">Collecté</p>
          <p className="text-lg font-semibold text-green-400">
            {totalCollected.toLocaleString()} Ar
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-400">Attendu</p>
          <p className="text-lg font-semibold">
            {totalExpected.toLocaleString()} Ar
          </p>
        </div>
      </div>

      {/* Table */}
      <ContributionTable
        contributions={period.contributions}
        onToggleStatus={onToggleStatus}
      />
    </div>
  )
}