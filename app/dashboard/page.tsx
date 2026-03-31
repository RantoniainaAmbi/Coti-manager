import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Chart from "@/components/Chart"
import StatCard from "@/components/StatCard"
import { Users, Wallet, TrendingDown, Landmark } from "lucide-react" 

export default async function DashboardPage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  // Récupération des données
  const totalMembers = await prisma.member.count()

  const periods = await prisma.period.findMany({
    orderBy: { year: "desc" },
    take: 1,
    include: { contributions: true },
  })

  const latestPeriod = periods[0] ?? null

  const totalExpenses = await prisma.expense.aggregate({
    _sum: { amount: true },
  })

  const paidCount =
    latestPeriod?.contributions.filter((c) => c.status === "PAID").length ?? 0

  const totalCollected = latestPeriod
    ? paidCount * latestPeriod.amount
    : 0

  const totalExpensesAmount = totalExpenses._sum.amount ?? 0
  const balance = totalCollected - totalExpensesAmount

  const chartData = [
    { name: "Collecté", value: totalCollected },
    { name: "Dépenses", value: totalExpensesAmount },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm">Vue globale de la trésorerie</p>
      </div>

      {/* Grille des statistiques avec variantes de couleurs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Membres - Variante Info (Violet) */}
        <StatCard 
          label="Membres" 
          value={totalMembers} 
          variant="info"
          icon={<Users size={18} />} 
        />

        {/* Collecté - Variante Success (Émeraude) */}
        <StatCard 
          label="Collecté" 
          value={`${totalCollected.toLocaleString()} Ar`} 
          variant="success"
          icon={<Wallet size={18} />}
        />

        {/* Dépenses - Variante Danger (Rose/Rouge) */}
        <StatCard 
          label="Dépenses" 
          value={`${totalExpensesAmount.toLocaleString()} Ar`} 
          variant="danger"
          icon={<TrendingDown size={18} />}
        />

        {/* Solde - Dynamique selon la balance */}
        <StatCard
          label="Solde"
          value={`${balance.toLocaleString()} Ar`}
          variant={balance >= 0 ? "success" : "danger"}
          icon={<Landmark size={18} />}
        />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-medium text-white mb-6">Analyse des flux</h3>
        <Chart data={chartData} />
      </div>

    </div>
  )
}