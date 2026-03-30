"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Member = {
  id: string
  name: string
  pseudo: string
}

interface EditMemberFormProps {
  member: Member
  onClose: () => void
}

export default function EditMemberForm({ member, onClose }: EditMemberFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: member.name,
    pseudo: member.pseudo,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/members/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Erreur lors de la modification")

      router.refresh() 
      onClose()       
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
      <h2 className="font-semibold text-lg text-white">Modifier le membre</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm text-gray-400 block">Nom</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-400 block">Pseudo</label>
          <input
            type="text"
            value={formData.pseudo}
            onChange={(e) => setFormData({ ...formData, pseudo: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg font-medium transition-all"
          >
            {loading ? "Enregistrement..." : "Sauvegarder"}
          </button>
        </div>
      </form>
    </div>
  )
}