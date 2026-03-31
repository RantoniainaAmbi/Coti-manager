"use client"

import { useState, ChangeEvent } from "react"
import { toast } from "sonner"

const MONTHS: string[] = [
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
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(): Promise<void> {
    if (!formData.amount) {
      const message = "Veuillez renseigner le montant de la période"
      setError(message)
      toast.error(message)
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/periods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: Number(formData.month),
          year: Number(formData.year),
          amount: parseFloat(formData.amount),
          memberIds: members.map((m) => m.id),
        }),
      })

      if (!res.ok) {
        const contentType = res.headers.get("content-type")
        const message = contentType?.includes("application/json")
          ? ((await res.json().catch(() => null)) as { error?: string } | null)?.error ?? "Erreur lors de la création"
          : "Le serveur a renvoyé une erreur inattendue."

        setError(message)
        toast.error(message)
        return
      }

      setFormData({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        amount: ""
      })
      toast.success("Période créée avec succès")
      onSaved()
    } catch (err: unknown) {
      const message = "Erreur réseau ou serveur."
      setError(message)
      toast.error(message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4 animate-in fade-in slide-in-from-top-2">
      <h2 className="font-medium text-white">Nouvelle période</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <select
          name="month"
          value={formData.month}
          onChange={handleChange}
          className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-violet-500 outline-none"
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
          className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-violet-500 outline-none"
        />

        <input
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Montant"
          className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-violet-500 outline-none"
        />
      </div>

      {error && <p className="text-red-400 text-sm bg-red-400/10 p-2 rounded-md border border-red-400/20">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-40 transition-colors font-medium"
      >
        {loading ? "Création..." : "Créer la période"}
      </button>
    </div>
  )
}