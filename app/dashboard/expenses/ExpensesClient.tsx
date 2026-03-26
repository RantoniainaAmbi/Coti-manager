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
      body: JSON.stringify({ label, amount: parseFloat(amount), date }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Erreur lors de la création")
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

      {/* Total */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <p className="text-gray-400 text-sm">📤 Total des dépenses</p>
        <p className="text-3xl font-bold text-red-400 mt-1">{total.toLocaleString()} Ar</p>
      </div>

      {/* Bouton ajouter */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-violet-600 hover:bg-violet-500 px-5 py-2.5 rounded-lg font-medium transition-colors"
      >
        {showForm ? "Annuler" : "+ Ajouter une dépense"}
      </button>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">Nouvelle dépense</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1 sm:col-span-1">
              <label className="text-sm text-gray-400">Libellé</label>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Ex: Achat matériel"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Montant (Ar)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="10000"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            onClick={handleAddExpense}
            disabled={loading}
            className="bg-violet-600 hover:bg-violet-500 px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-40"
          >
            {loading ? "Ajout..." : "Ajouter"}
          </button>
        </div>
      )}

      {/* Liste */}
      {expenses.length === 0 ? (
        <p className="text-gray-500 text-center py-12">Aucune dépense enregistrée.</p>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-6 py-4 font-medium">Libellé</th>
                <th className="text-left px-6 py-4 font-medium">Date</th>
                <th className="text-left px-6 py-4 font-medium">Montant</th>
                <th className="text-right px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{expense.label}</td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(expense.date).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 text-red-400 font-medium">
                    -{expense.amount.toLocaleString()} Ar
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors text-xs border border-gray-700 hover:border-red-800 px-3 py-1.5 rounded-lg"
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