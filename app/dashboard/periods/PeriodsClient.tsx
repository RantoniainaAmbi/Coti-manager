"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import AddPeriodForm from "@/components/dashboards/periods/AddPeriodForm"
import PeriodList from "@/components/dashboards/periods/PeriodList"
import PeriodDetails from "@/components/dashboards/periods/PeriodsDetails"
import { Period, Member } from "@/components/dashboards/periods/types"

interface PeriodsClientProps {
  periods: Period[]
  members: Member[]
}

export default function PeriodsClient({ periods, members }: PeriodsClientProps) {
  const router = useRouter()
  const [showForm, setShowForm] = useState<boolean>(false)

  const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(
    periods[0]?.id ?? null
  )

  const selectedPeriod = useMemo(() => {
    return periods.find((p) => p.id === selectedPeriodId) || periods[0] || null
  }, [periods, selectedPeriodId])

  async function handleToggleStatus(id: string, status: string): Promise<void> {
    const newStatus: string = status === "PAID" ? "PENDING" : "PAID"
    try {
      const response: Response = await fetch(`/api/contributions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        router.refresh()
      }
    } catch (error: unknown) {
      console.error("Erreur status:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Gestion des Cotisations</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          {showForm ? "Annuler" : "+ Nouvelle période"}
        </button>
      </div>

      {showForm && (
        <AddPeriodForm
          members={members}
          onSaved={() => {
            setShowForm(false)
            router.refresh()
          }}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PeriodList
            periods={periods}
            selectedPeriod={selectedPeriod}
            onSelectPeriod={(p: Period) => setSelectedPeriodId(p.id)}
          />
        </div>

        <div className="lg:col-span-2">
          {selectedPeriod ? (
            <PeriodDetails
              period={selectedPeriod}
              members={members}
              onToggleStatus={handleToggleStatus}
            />
          ) : (
            <div className="text-gray-500 text-center p-12">
              Sélectionnez une période
            </div>
          )}
        </div>
      </div>
    </div>
  )
}