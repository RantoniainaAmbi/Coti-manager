"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
]

type Contribution = {
  id: string
  status: string
  paidAt: Date | null
  memberId: string
  member: { id: string; name: string; pseudo: string }
}

type Period = {
  id: string
  month: number
  year: number
  amount: number
  contributions: Contribution[]
}

type Member = {
  id: string
  name: string
  pseudo: string
}

export default function PeriodsClient({
  periods,
  members,
}: {
  periods: Period[]
  members: Member[]
}) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(
    periods[0] ?? null
  )

  async function handleCreatePeriod() {
    if (!amount) return
    setLoading(true)
    setError("")

    const res = await fetch("/api/periods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month, year, amount: parseFloat(amount), memberIds: members.map((m) => m.id) }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Erreur lors de la création")
      return
    }

    setShowForm(false)
    setAmount("")
    router.refresh()
  }

  async function handleToggleStatus(contributionId: string, currentStatus: string) {
    const newStatus = currentStatus === "PAID" ? "PENDING" : "PAID"
    await fetch(`/api/contributions/${contributionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    router.refresh()
  }

  const paidCount = selectedPeriod?.contributions.filter((c) => c.status === "PAID").length ?? 0
  const totalCount = selectedPeriod?.contributions.length ?? 0
  const totalCollected = paidCount * (selectedPeriod?.amount ?? 0)
  const totalExpected = totalCount * (selectedPeriod?.amount ?? 0)

  return (
    <div className="space-y-6">

      {/* Bouton créer période */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-violet-600 hover:bg-violet-500 px-5 py-2.5 rounded-lg font-medium transition-colors"
      >
        {showForm ? "Annuler" : "+ Nouvelle période"}
      </button>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">Nouvelle période de cotisation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Mois</label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {MONTHS.map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Année</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Montant (Ar)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="5000"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            onClick={handleCreatePeriod}
            disabled={loading}
            className="bg-violet-600 hover:bg-violet-500 px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-40"
          >
            {loading ? "Création..." : "Créer la période"}
          </button>
        </div>
      )}

      {periods.length === 0 ? (
        <p className="text-gray-500 text-center py-12">Aucune période créée pour l`&aposinstant.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Liste des périodes */}
          <div className="space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Périodes</p>
            {periods.map((period) => {
              const paid = period.contributions.filter((c) => c.status === "PAID").length
              const total = period.contributions.length
              return (
                <button
                  key={period.id}
                  onClick={() => setSelectedPeriod(period)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedPeriod?.id === period.id
                      ? "bg-violet-600/20 border-violet-500"
                      : "bg-gray-900 border-gray-800 hover:border-gray-600"
                  }`}
                >
                  <p className="font-medium">{MONTHS[period.month - 1]} {period.year}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {paid}/{total} payés · {period.amount.toLocaleString()} Ar
                  </p>
                </button>
              )
            })}
          </div>

          {/* Détail de la période sélectionnée */}
          {selectedPeriod && (
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <p className="text-gray-400 text-sm">Collecté</p>
                  <p className="text-xl font-bold text-green-400">{totalCollected.toLocaleString()} Ar</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <p className="text-gray-400 text-sm">Attendu</p>
                  <p className="text-xl font-bold">{totalExpected.toLocaleString()} Ar</p>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="text-left px-6 py-4 font-medium">Membre</th>
                      <th className="text-left px-6 py-4 font-medium">Statut</th>
                      <th className="text-right px-6 py-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPeriod.contributions.map((contribution) => (
                      <tr key={contribution.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium">{contribution.member.name}</p>
                          <p className="text-gray-500 text-xs">@{contribution.member.pseudo}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            contribution.status === "PAID"
                              ? "bg-green-500/20 text-green-400"
                              : contribution.status === "LATE"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}>
                            {contribution.status === "PAID" ? "Payé" :
                             contribution.status === "LATE" ? "En retard" : "En attente"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleToggleStatus(contribution.id, contribution.status)}
                            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                              contribution.status === "PAID"
                                ? "border-gray-700 text-gray-400 hover:border-red-800 hover:text-red-400"
                                : "border-green-800 text-green-400 hover:bg-green-500/10"
                            }`}
                          >
                            {contribution.status === "PAID" ? "Annuler" : "Marquer payé"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}