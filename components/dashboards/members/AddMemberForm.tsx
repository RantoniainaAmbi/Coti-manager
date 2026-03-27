"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" 

export default function AddMemberForm({ onSaved }: { onSaved: () => void }) {
  const router = useRouter() 
  const [formData, setFormData] = useState({
    name: "",
    pseudo: "",
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    if (Object.values(formData).some((v) => !v)) {
      setError("Veuillez remplir tous les champs")
      return
    }
    
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "Erreur lors de la création")
      }

      setFormData({ name: "", pseudo: "", email: "", password: "" })
      
      // --- AJOUTS ICI ---
      router.refresh() // Force Next.js à rafraîchir les données serveurs (la liste des périodes)
      onSaved()        // Appelle la fonction de fermeture/succès du parent
      // -----------------

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Une erreur inattendue est survenue")
      }
    } finally {
      setLoading(false)
    }
  }

  // ... le reste de ton code (fields et return) reste identique
  const fields = [
    { name: "name", label: "Nom", placeholder: "Jean Dupont", type: "text" },
    { name: "pseudo", label: "Pseudo", placeholder: "jean42", type: "text" },
    { name: "email", label: "Email de connexion", placeholder: "jean@email.com", type: "email" },
    { name: "password", label: "Mot de passe temporaire", placeholder: "••••••••", type: "text" },
  ]

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 md:p-6 space-y-4 animate-in fade-in slide-in-from-top-2">
      <h2 className="font-semibold text-base md:text-lg text-white">Nouveau membre</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-1">
            <label className="text-sm text-gray-400 block">
              {field.label}
            </label>
            <input
              name={field.name}
              type={field.type}
              value={formData[field.name as keyof typeof formData]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-sm md:text-base outline-none"
            />
          </div>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm animate-pulse">{error}</p>}

      <div className="pt-2">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 text-sm md:text-base"
        >
          {loading ? "Création en cours..." : "Créer le membre"}
        </button>
      </div>
    </div>
  )
}