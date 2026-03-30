"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AddMemberForm from "@/components/dashboards/members/AddMemberForm"
import MemberTable from "@/components/dashboards/members/MemberTable"
import EditMemberForm from "@/components/dashboards/members/EditMemberForm" 
import { Member } from "@/components/dashboards/members/types"

export default function MembersClient({ members }: { members: Member[] }) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null) 

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce membre ? Cela supprimera aussi ses cotisations.")) return
    
    const res = await fetch(`/api/members/${id}`, { method: "DELETE" })
    if (res.ok) {
      router.refresh()
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500 px-4 md:px-5 py-2.5 rounded-lg font-medium transition-colors text-sm md:text-base text-white"
      >
        {showForm ? "Annuler" : "+ Ajouter un membre"}
      </button>

      {showForm && (
        <AddMemberForm onSaved={() => {
          setShowForm(false)
          router.refresh()
        }} />
      )}

      <MemberTable 
        members={members} 
        onDelete={handleDelete} 
        onEdit={(member: Member) => setEditingMember(member)} 
      />

      {editingMember && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-md shadow-2xl">
            <EditMemberForm 
              member={editingMember} 
              onClose={() => setEditingMember(null)} 
            />
          </div>
        </div>
      )}
    </div>
  )
}