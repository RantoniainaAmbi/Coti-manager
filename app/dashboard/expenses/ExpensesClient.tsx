"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Expense = {
  id: string
  label: string
  amount: number
  date: Date
}

export default function ExpensesClient({ expenses }: { expenses: Expense[] }) {
  const router = useRouter()

  const [showForm, setShowForm] = useState(false)
  const [label, setLabel] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  async function handleAddExpense() {
    if (!label || !amount) return

    setLoading(true)
    setError("")

    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label,
        amount: parseFloat(amount),
        date,
      }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Erreur")
      return
    }

    setLabel("")
    setAmount("")
    setDate(new Date().toISOString().split("T")[0])
    setShowForm(false)
    router.refresh()
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette dépense ?")) return
    await fetch(`/api/expenses/${id}`, { method: "DELETE" })
    router.refresh()
  }

  return (
    <div className="space-y-6">

      {/* Header stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-400">Total des dépenses</p>
          <p className="text-2xl font-semibold text-red-400 mt-1">
            {total.toLocaleString()} Ar
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-400">Nombre de dépenses</p>
          <p className="text-2xl font-semibold">
            {expenses.length}
          </p>
        </div>

      </div>

      {/* Action */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-lg text-sm font-medium transition"
      >
        {showForm ? "Annuler" : "+ Ajouter une dépense"}
      </button>

      {/* Form */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">

          <h2 className="font-medium">Nouvelle dépense</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Libellé"
              className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2"
            />

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Montant"
              className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2"
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2"
            />

          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            onClick={handleAddExpense}
            disabled={loading}
            className="bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-lg text-sm"
          >
            {loading ? "Ajout..." : "Ajouter"}
          </button>

        </div>
      )}

      {/* Table */}
      {expenses.length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          Aucune dépense enregistrée
        </p>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

          <table className="w-full text-sm">

            <thead className="text-gray-400 text-xs border-b border-gray-800">
              <tr>
                <th className="px-4 py-3 text-left">Libellé</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Montant</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-t border-gray-800 hover:bg-gray-800/40 transition"
                >
                  <td className="px-4 py-3 font-medium">
                    {expense.label}
                  </td>

                  <td className="px-4 py-3 text-gray-400">
                    {new Date(expense.date).toLocaleDateString("fr-FR")}
                  </td>

                  <td className="px-4 py-3 text-red-400 font-medium">
                    -{expense.amount.toLocaleString()} Ar
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:border-red-500 hover:text-red-400 transition"
                    >
                      Supprimer
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}

    </div>
  )
}