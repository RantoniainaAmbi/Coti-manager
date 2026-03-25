"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Member = {
  id: string
  name: string
  pseudo: string
  createdAt: Date
  user: {
    email: string
    role: string
  }
}

export default function MembersClient({ members }: { members: Member[] }) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [pseudo, setPseudo] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleAddMember() {
    if (!name || !pseudo || !email || !password) return
    setLoading(true)
    setError("")

    const res = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, pseudo, email, password }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Erreur lors de la création")
      return
    }

    setName("")
    setPseudo("")
    setEmail("")
    setPassword("")
    setShowForm(false)
    router.refresh()
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce membre ?")) return
    await fetch(`/api/members/${id}`, { method: "DELETE" })
    router.refresh()
  }

  return (
    <div className="space-y-6">

      {/* Bouton ajouter */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-violet-600 hover:bg-violet-500 px-5 py-2.5 rounded-lg font-medium transition-colors"
      >
        {showForm ? "Annuler" : "+ Ajouter un membre"}
      </button>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">Nouveau membre</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Nom</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jean Dupont"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Pseudo</label>
              <input
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                placeholder="jean42"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Email de connexion</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jean@email.com"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Mot de passe temporaire</label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="motdepasse123"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            onClick={handleAddMember}
            disabled={loading}
            className="bg-violet-600 hover:bg-violet-500 px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-40"
          >
            {loading ? "Création..." : "Créer le membre"}
          </button>
        </div>
      )}

      {/* Liste des membres */}
      {members.length === 0 ? (
        <p className="text-gray-500 text-center py-12">Aucun membre pour l&apos;instant.</p>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-6 py-4 font-medium">Nom</th>
                <th className="text-left px-6 py-4 font-medium">Pseudo</th>
                <th className="text-left px-6 py-4 font-medium">Email</th>
                <th className="text-right px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{member.name}</td>
                  <td className="px-6 py-4 text-gray-400">@{member.pseudo}</td>
                  <td className="px-6 py-4 text-gray-400">{member.user.email}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(member.id)}
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