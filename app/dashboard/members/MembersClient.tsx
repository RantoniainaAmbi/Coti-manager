"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AddMemberForm from "@/components/dashboards/members/AddMemberForm"
import MemberTable from "@/components/dashboards/members/MemberTable"
import { Member } from "@/components/dashboards/members/types"

export default function MembersClient({ members }: { members: Member[] }) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce membre ?")) return
    await fetch(`/api/members/${id}`, { method: "DELETE" })
    router.refresh()
  }

  return (
    <div className="space-y-4 md:space-y-6">

      {/* Bouton ajouter */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500 px-4 md:px-5 py-2.5 rounded-lg font-medium transition-colors text-sm md:text-base"
      >
        {showForm ? "Annuler" : "+ Ajouter un membre"}
      </button>

      {/* Formulaire */}
      {showForm && (
        <AddMemberForm onSaved={() => {
          setShowForm(false)
          router.refresh()
        }} />
      )}

      {/* Liste des membres */}
      <MemberTable members={members} onDelete={handleDelete} />
    </div>
  )
}