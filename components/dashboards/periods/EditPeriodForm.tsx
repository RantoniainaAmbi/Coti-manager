"use client"

import { useState, FormEvent } from "react"
import { Member } from "./types"

interface EditPeriodFormProps {
  periodId: string
  initialMonth: number
  initialYear: number
  initialAmount: number
  members: Member[] // Inclus pour la cohérence des types
  onSaved: () => void
}

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
]

export default function EditPeriodForm({
  periodId,
  initialMonth,
  initialYear,
  initialAmount,
  onSaved,
}: EditPeriodFormProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [month, setMonth] = useState<number>(initialMonth)
  const [year, setYear] = useState<number>(initialYear)
  const [amount, setAmount] = useState<number>(initialAmount)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response: Response = await fetch(`/api/periods/${periodId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          month: Number(month), 
          year: Number(year), 
          amount: Number(amount) 
        }),
      })

      if (!response.ok) {
        const data = await response.json() as { error: string }
        throw new Error(data.error || "Erreur lors de la modification")
      }

      onSaved()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Une erreur inconnue est survenue")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
      <h3 className="text-lg font-semibold text-white mb-4">Modifier la période</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium">Mois</label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-violet-500 outline-none transition"
            >
              {MONTHS.map((name, index) => (
                <option key={index + 1} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium">Année</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-violet-500 outline-none transition"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-400 font-medium">Montant de la cotisation (€)</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-violet-500 outline-none transition"
            placeholder="Ex: 50"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-bold py-2.5 rounded-lg transition-all shadow-lg shadow-violet-500/20"
          >
            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  )
}