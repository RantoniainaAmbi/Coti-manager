import { Member } from "./types"

interface MemberTableProps {
  members: Member[]
  onDelete: (id: string) => void
}

export default function MemberTable({ members, onDelete }: MemberTableProps) {
  if (members.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8 md:py-12 bg-gray-900/50 border border-gray-800 rounded-2xl text-sm md:text-base">
        Aucun membre pour l`&#39instant.
      </p>
    )
  }

  return (
    <>
      {/* Vue mobile - Cartes (Visible uniquement sur < 768px) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex justify-between items-center group active:bg-gray-800/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-200 truncate">{member.name}</h3>
                <span className="text-[10px] bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  @{member.pseudo}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 truncate">{member.user.email}</p>
            </div>
            
            <button
              onClick={() => onDelete(member.id)}
              className="ml-4 text-gray-500 hover:text-rose-400 border border-gray-800 hover:border-rose-900/50 p-2 rounded-lg transition-all"
              aria-label="Supprimer"
            >
              {/* Icône poubelle simplifiée pour le mobile */}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Vue desktop - Tableau (Masqué sur mobile) */}
      <div className="hidden md:block bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Nom</th>
              <th className="px-6 py-4 font-medium">Pseudo</th>
              <th className="px-6 py-4 font-medium text-hidden lg:table-cell">Email</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {members.map((member) => (
              <tr
                key={member.id}
                className="hover:bg-gray-800/30 transition-colors group"
              >
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-200">{member.name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-400 group-hover:text-gray-300">@{member.pseudo}</span>
                </td>
                <td className="px-6 py-4 text-gray-400 group-hover:text-gray-300 text-hidden lg:table-cell">
                  {member.user.email}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onDelete(member.id)}
                    className="text-gray-500 hover:text-rose-400 border border-gray-700 hover:border-rose-900/50 px-3 py-1.5 rounded-lg transition-all text-xs"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}