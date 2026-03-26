import { Expense } from "./types"

interface ExpenseTableProps {
  expenses: Expense[]
  onDelete: (id: string) => void
}

export default function ExpenseTable({ expenses, onDelete }: ExpenseTableProps) {
  if (expenses.length === 0) {
    return (
      <p className="text-gray-500 text-center py-12 bg-gray-900/50 border border-gray-800 rounded-xl">
        Aucune dépense enregistrée
      </p>
    )
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
            <th className="px-4 py-3 text-left">Libellé</th>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Montant</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {expenses.map((expense) => (
            <tr
              key={expense.id}
              className="hover:bg-gray-800/30 transition-colors group"
            >
              <td className="px-4 py-3 font-medium text-gray-200">
                {expense.label}
              </td>
              <td className="px-4 py-3 text-gray-400 group-hover:text-gray-300">
                {new Date(expense.date).toLocaleDateString("fr-FR")}
              </td>
              <td className="px-4 py-3 text-red-400 font-medium group-hover:text-red-300">
                -{expense.amount.toLocaleString()} Ar
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onDelete(expense.id)}
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
  )
}