"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import EditPeriodForm from "@/components/dashboards/periods/EditPeriodForm"
import { Period, Member } from "@/components/dashboards/periods/types"

interface PeriodDetailsProps {
  period: Period
  members: Member[]
  onToggleStatus: (id: string, status: string) => Promise<void>
}

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
]

export default function PeriodDetails({
  period,
  members,
  onToggleStatus,
}: PeriodDetailsProps) {
  const router = useRouter()
  const [showEditForm, setShowEditForm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [toggling, setToggling] = useState<string | null>(null)

  const handleToggleStatus = async (contributionId: string, status: string) => {
    setToggling(contributionId)
    await onToggleStatus(contributionId, status)
    setToggling(null)
  }

  const handleDelete = async () => {
    if (!confirm("Supprimer cette période ? Cela effacera toutes les contributions liées.")) {
      return
    }

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/periods/${period.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert("Erreur lors de la suppression")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  const paidCount = period.contributions.filter(c => c.status === "PAID").length
  const totalCount = period.contributions.length
  const progress = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0

  if (showEditForm) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setShowEditForm(false)}
          className="text-gray-400 hover:text-gray-300 text-sm flex items-center gap-2"
        >
          ← Retour
        </button>
        <EditPeriodForm
          periodId={period.id}
          initialMonth={period.month}
          initialYear={period.year}
          initialAmount={period.amount}
          members={members}
          onSaved={() => {
            setShowEditForm(false)
            router.refresh()
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white">
              {MONTHS[period.month - 1]} {period.year}
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Objectif : <span className="text-violet-400 font-medium">{period.amount}€</span>
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowEditForm(true)}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Modifier
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-900/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-900/50 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
            >
              {isDeleting ? "..." : "Supprimer"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-800">
            <p className="text-gray-400 text-xs mb-1">Payées</p>
            <p className="text-2xl font-bold text-green-400">{paidCount}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-800">
            <p className="text-gray-400 text-xs mb-1">En attente</p>
            <p className="text-2xl font-bold text-yellow-400">{totalCount - paidCount}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Progression globale</span>
            <span className="text-gray-200 font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-violet-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h4 className="font-semibold text-white mb-4">Membres ({totalCount})</h4>
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {period.contributions.map((contribution) => (
            <div
              key={contribution.id}
              className="flex items-center justify-between p-3 bg-gray-800/40 rounded-lg border border-gray-800/50"
            >
              <div>
                <p className="text-sm font-medium text-gray-200">{contribution.member.name}</p>
                <p className="text-xs text-gray-500">@{contribution.member.pseudo}</p>
              </div>
              <button
                onClick={() => handleToggleStatus(contribution.id, contribution.status)}
                disabled={toggling === contribution.id}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                  contribution.status === "PAID"
                    ? "bg-green-500/10 text-green-500 border border-green-500/20"
                    : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                } disabled:opacity-50`}
              >
                {contribution.status === "PAID" ? "PAYÉ" : "EN ATTENTE"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}