"use client"

import { useState } from "react"

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
]

interface AddPeriodFormProps {
  members: { id: string; name: string; pseudo: string }[]
  onSaved: () => void
}

export default function AddPeriodForm({ members, onSaved }: AddPeriodFormProps) {
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    amount: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    if (!formData.amount) return

    setLoading(true)
    setError("")

    const res = await fetch("/api/periods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        month: formData.month,
        year: formData.year,
        amount: parseFloat(formData.amount),
        memberIds: members.map((m) => m.id),
      }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Erreur")
      return
    }

    setFormData({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      amount: ""
    })
    onSaved()
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4 animate-in fade-in slide-in-from-top-2">
      <h2 className="font-medium">Nouvelle période</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <select
          name="month"
          value={formData.month}
          onChange={handleChange}
          className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-500 outline-none"
        >
          {MONTHS.map((m, i) => (
            <option key={i} value={i + 1}>{m}</option>
          ))}
        </select>

        <input
          name="year"
          type="number"
          value={formData.year}
          onChange={handleChange}
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
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded-lg text-sm disabled:opacity-40 transition-colors"
      >
        {loading ? "Création..." : "Créer"}
      </button>
    </div>
  )
}