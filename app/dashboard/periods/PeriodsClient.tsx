"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AddPeriodForm from "@/components/dashboards/periods/AddPeriodForm"
import PeriodList from "@/components/dashboards/periods/PeriodList"
import PeriodDetails from "@/components/dashboards/periods/PeriodDetails"
import { Period, Member } from "@/components/dashboards/periods/types"

type Props = {
  periods: Period[]
  members: Member[]
}

export default function PeriodsClient({ periods, members }: Props) {
  const router = useRouter()

  const [showForm, setShowForm] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(
    periods[0] ?? null
  )

  async function handleToggleStatus(id: string, status: string) {
    const newStatus = status === "PAID" ? "PENDING" : "PAID"

    await fetch(`/api/contributions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })

    router.refresh()
  }

  return (
    <div className="space-y-6">

      {/* Action */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-lg text-sm font-medium transition"
      >
        {showForm ? "Annuler" : "+ Nouvelle période"}
      </button>

      {/* Formulaire */}
      {showForm && (
        <AddPeriodForm
          members={members}
          onSaved={() => {
            setShowForm(false)
            router.refresh()
          }}
        />
      )}

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Liste périodes */}
        <PeriodList
          periods={periods}
          selectedPeriod={selectedPeriod}
          onSelectPeriod={setSelectedPeriod}
        />

        {/* Détails */}
        {selectedPeriod && (
          <PeriodDetails
            period={selectedPeriod}
            onToggleStatus={handleToggleStatus}
          />
        )}

      </div>

    </div>
  )
}