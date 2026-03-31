"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { toast } from "sonner"
import AddMemberForm from "@/components/dashboards/members/AddMemberForm"
import MemberTable from "@/components/dashboards/members/MemberTable"
import EditMemberForm from "@/components/dashboards/members/EditMemberForm"
import { Member } from "@/components/dashboards/members/types"

export default function MembersClient({ members }: { members: Member[] }) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce membre ? Cela supprimera aussi ses cotisations.")) return

    try {
      const res = await fetch(`/api/members/${id}`, { method: "DELETE" })

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(data?.error ?? "Erreur lors de la suppression du membre")
      }

      toast.success("Membre supprimé avec succès")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Une erreur est survenue")
    }
  }

  const filteredMembers = useMemo(() => {
    return members.filter((member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.pseudo.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, members])

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Rechercher un membre (nom ou pseudo)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
        />
      </div>
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
        members={filteredMembers}
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