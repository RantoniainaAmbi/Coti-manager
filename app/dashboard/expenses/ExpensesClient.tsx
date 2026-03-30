"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AddExpenseForm from "@/components/dashboards/expenses/AddExpenseForm"
import ExpenseTable from "@/components/dashboards/expenses/ExpenseTable"
import { Expense } from "@/components/dashboards/expenses/types"

export default function ExpensesClient({ expenses }: { expenses: Expense[] }) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette dépense ?")) return
    await fetch(`/api/expenses/${id}`, { method: "DELETE" })
    router.refresh()
  }

  return (
    <div className="space-y-6">

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

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-lg text-sm font-medium transition"
      >
        {showForm ? "Annuler" : "+ Ajouter une dépense"}
      </button>

      {showForm && (
        <AddExpenseForm onSaved={() => {
          setShowForm(false)
          router.refresh()
        }} />
      )}

      {/* Table */}
      <ExpenseTable expenses={expenses} onDelete={handleDelete} />
    </div>
  )
}