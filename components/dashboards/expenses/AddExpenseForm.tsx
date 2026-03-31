"use client"

import { useState } from "react"
import { toast } from "sonner"

export default function AddExpenseForm({ onSaved }: { onSaved: () => void }) {
  const [formData, setFormData] = useState({
    label: "",
    amount: "",
    date: new Date().toISOString().split("T")[0]
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    if (!formData.label || !formData.amount) {
      const message = "Veuillez renseigner le libellé et le montant"
      setError(message)
      toast.error(message)
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: formData.label,
          amount: parseFloat(formData.amount),
          date: formData.date,
        }),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        const message = data?.error ?? "Erreur lors de l'ajout de la dépense"
        setError(message)
        toast.error(message)
        return
      }

      setFormData({
        label: "",
        amount: "",
        date: new Date().toISOString().split("T")[0]
      })
      toast.success("Dépense ajoutée avec succès")
      onSaved()
    } catch {
      const message = "Erreur réseau ou serveur."
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4 animate-in fade-in slide-in-from-top-2">
      <h2 className="font-medium">Nouvelle dépense</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          name="label"
          value={formData.label}
          onChange={handleChange}
          placeholder="Libellé"
          className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 outline-none"
        />

        <input
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Montant"
          className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 outline-none"
        />

        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 outline-none"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-lg text-sm disabled:opacity-40 transition-colors"
      >
        {loading ? "Ajout..." : "Ajouter"}
      </button>
    </div>
  )
}