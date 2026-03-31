"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { toast } from "sonner"
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

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PAID" | "PENDING">("ALL")

  const selectedPeriod = useMemo(() => {
    const period = periods.find((p) => p.id === selectedPeriodId) || periods[0] || null

    if (!period) return null

    const filteredContributions = period.contributions.filter((c) => {
      const matchesSearch = c.member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.member.pseudo.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "ALL" || c.status === statusFilter
      return matchesSearch && matchesStatus
    })

    return { ...period, contributions: filteredContributions }
  }, [periods, selectedPeriodId, searchTerm, statusFilter])

  async function handleToggleStatus(id: string, status: string): Promise<void> {
    const newStatus: string = status === "PAID" ? "PENDING" : "PAID"

    try {
      const response: Response = await fetch(`/api/contributions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(data?.error ?? "Erreur lors de la mise à jour du statut")
      }

      toast.success(
        newStatus === "PAID"
          ? "Cotisation marquée comme payée"
          : "Cotisation repassée en attente"
      )
      router.refresh()
    } catch (error: unknown) {
      console.error("Erreur status:", error)
      toast.error(error instanceof Error ? error.message : "Erreur lors de la mise à jour du statut")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-white">Gestion des Cotisations</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-violet-600 hover:bg-violet-500 transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium"
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

      <div className="flex flex-col md:flex-row gap-4 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Rechercher un membre dans cette période..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-violet-500 outline-none"
          />
        </div>

        <div className="flex bg-gray-950 rounded-lg p-1 border border-gray-800">
          {(["ALL", "PAID", "PENDING"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                statusFilter === s
                  ? "bg-violet-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {s === "ALL" ? "Tous" : s === "PAID" ? "Payés" : "Impayés"}
            </button>
          ))}
        </div>
      </div>

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
            <div className="bg-gray-900/50 border border-dashed border-gray-800 rounded-2xl flex items-center justify-center p-12">
              <p className="text-gray-500 italic">Sélectionnez une période pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}