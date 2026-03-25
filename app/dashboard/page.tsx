import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Chart from "@/components/Chart"
import StatCard from "@/components/StatCard"

export default async function DashboardPage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

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
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-400 text-sm">Vue globale</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard label="Membres" value={totalMembers} />
        <StatCard label="Collecté" value={`${totalCollected} Ar`} />
        <StatCard label="Dépenses" value={`${totalExpensesAmount} Ar`} />
        <StatCard
          label="Solde"
          value={`${balance} Ar`}
          highlight={balance >= 0 ? "positive" : "negative"}
        />
      </div>

      <Chart data={chartData} />

    </div>
  )
}