import { Contribution } from "./types"

interface ContributionTableProps {
  contributions: Contribution[]
  onToggleStatus: (id: string, status: string) => void
}

export default function ContributionTable({ contributions, onToggleStatus }: ContributionTableProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
            <th className="px-4 py-3 text-left">Membre</th>
            <th className="px-4 py-3 text-center">Statut</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {contributions.map((c) => (
            <tr
              key={c.id}
              className="hover:bg-gray-800/30 transition-colors group"
            >
              <td className="px-4 py-3">
                <p className="font-medium text-gray-200">{c.member.name}</p>
                <p className="text-xs text-gray-500">@{c.member.pseudo}</p>
              </td>

              <td className="px-4 py-3 text-center">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    c.status === "PAID"
                      ? "bg-green-500/20 text-green-400"
                      : c.status === "LATE"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {c.status === "PAID"
                    ? "Payé"
                    : c.status === "LATE"
                    ? "En retard"
                    : "En attente"}
                </span>
              </td>

              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onToggleStatus(c.id, c.status)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                    c.status === "PAID"
                      ? "border-gray-700 text-gray-400 hover:border-red-500 hover:text-red-400"
                      : "border-green-700 text-green-400 hover:bg-green-500/10"
                  }`}
                >
                  {c.status === "PAID"
                    ? "Annuler"
                    : "Marquer payé"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}