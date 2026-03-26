type Contribution = {
  id: string
  status: 'paid' | 'pending' | 'overdue' | string 
  period: { month: number; year: number; amount: number }
}

const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case 'paid':
    case 'payé':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    case 'pending':
    case 'en attente':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
  }
}

export default function MemberContributions({
  contributions,
}: {
  contributions: Contribution[]
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-100">Mes cotisations</h2>
        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
          {contributions.length} Historique
        </span>
      </div>

      {/* Liste */}
      <div className="divide-y divide-gray-800">
        {contributions.map((c) => (
          <div 
            key={c.id} 
            className="flex justify-between items-center px-5 py-4 hover:bg-gray-800/50 transition-colors group"
          >
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-200">
                {MONTHS[c.period.month - 1]} {c.period.year}
              </p>
              <p className="text-xs font-mono text-gray-500">
                {c.period.amount.toLocaleString()} <span className="text-[10px]">Ar</span>
              </p>
            </div>

            <span className={`
              text-[11px] font-medium px-2.5 py-0.5 rounded-full border
              ${getStatusStyles(c.status)}
            `}>
              {c.status}
            </span>
          </div>
        ))}
      </div>
      

    </div>
  )
}