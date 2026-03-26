"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
]

type Member = {
  id: string
  name: string
  pseudo: string
}

type Contribution = {
  id: string
  status: "PAID" | "PENDING" | "LATE"
  memberId: string
  member: Member
}

type Period = {
  id: string
  month: number
  year: number
  amount: number
  contributions: Contribution[]
}

type Props = {
  periods: Period[]
  members: Member[]
}

export default function PeriodsClient({ periods, members }: Props) {
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
      body: JSON.stringify({
        month,
        year,
        amount: parseFloat(amount),
        memberIds: members.map((m) => m.id),
      }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Erreur")
      return
    }

    setShowForm(false)
    setAmount("")
    router.refresh()
  }

  async function handleToggleStatus(id: string, status: string) {
    const newStatus = status === "PAID" ? "PENDING" : "PAID"

    await fetch(`/api/contributions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })

    router.refresh()
  }

  // Calculs
  const paidCount =
    selectedPeriod?.contributions.filter((c) => c.status === "PAID").length ?? 0

  const totalCount = selectedPeriod?.contributions.length ?? 0

  const totalCollected = paidCount * (selectedPeriod?.amount ?? 0)
  const totalExpected = totalCount * (selectedPeriod?.amount ?? 0)

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
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="font-medium">Nouvelle période</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2"
            >
              {MONTHS.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>

            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2"
            />

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Montant"
              className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2"
            />

          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            onClick={handleCreatePeriod}
            disabled={loading}
            className="bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-lg text-sm"
          >
            {loading ? "Création..." : "Créer"}
          </button>
        </div>
      )}

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Liste périodes */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-2">
          <p className="text-xs text-gray-500 uppercase">Périodes</p>

          {periods.map((p) => {
            const paid = p.contributions.filter(c => c.status === "PAID").length
            const total = p.contributions.length

            return (
              <button
                key={p.id}
                onClick={() => setSelectedPeriod(p)}
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

        {/* Détails */}
        {selectedPeriod && (
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
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">

                <thead className="text-gray-400 text-xs border-b border-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left">Membre</th>
                    <th className="px-4 py-3 text-center">Statut</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedPeriod.contributions.map((c) => (
                    <tr
                      key={c.id}
                      className="border-t border-gray-800 hover:bg-gray-800/40 transition"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium">{c.member.name}</p>
                        <p className="text-xs text-gray-500">@{c.member.pseudo}</p>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            c.status === "PAID"
                              ? "bg-green-500/20 text-green-400"
                              : c.status === "LATE"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {c.status === "PAID"
                            ? "Payé"
                            : c.status === "LATE"
                            ? "En retard"
                            : "En attente"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() =>
                            handleToggleStatus(c.id, c.status)
                          }
                          className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                            c.status === "PAID"
                              ? "border-gray-700 text-gray-400 hover:border-red-500 hover:text-red-400"
                              : "border-green-700 text-green-400 hover:bg-green-500/10"
                          }`}
                        >
                          {c.status === "PAID"
                            ? "Annuler"
                            : "Marquer payé"}
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

    </div>
  )
}