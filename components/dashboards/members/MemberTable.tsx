import { Edit2, Trash2, Mail, User } from "lucide-react"
import { Member } from "./types"

interface MemberTableProps {
  members: Member[]
  onDelete: (id: string) => void
  onEdit: (member: Member) => void 
}

export default function MemberTable({ members, onDelete, onEdit }: MemberTableProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/50">
              <th className="p-4 text-xs font-medium text-gray-400 uppercase">Membre</th>
              <th className="p-4 text-xs font-medium text-gray-400 uppercase hidden md:table-cell text-center">Email</th>
              <th className="p-4 text-xs font-medium text-gray-400 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-800/30 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-violet-400">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{member.name}</p>
                      <p className="text-xs text-gray-500">@{member.pseudo}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 hidden md:table-cell text-sm text-gray-400 text-center">
                   {member.user.email}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onEdit(member)}
                      className="p-2 text-gray-400 hover:text-violet-400 hover:bg-violet-400/10 rounded-lg transition"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(member.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}