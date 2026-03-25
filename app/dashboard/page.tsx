import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import SignOutButton from "./SignOutButton" 

export default async function DashboardPage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const totalMembers = await prisma.member.count()

  const periods = await prisma.period.findMany({
    orderBy: { year: "desc" },
    take: 1,
    include: {
      contributions: true,
    },
  })

  const latestPeriod = periods[0] ?? null

  const totalExpenses = await prisma.expense.aggregate({
    _sum: { amount: true },
  })

  const paidCount = latestPeriod
    ? latestPeriod.contributions.filter((c) => c.status === "PAID").length
    : 0

  const totalCollected = latestPeriod ? paidCount * latestPeriod.amount : 0
  const totalExpensesAmount = totalExpenses._sum.amount ?? 0
  const balance = totalCollected - totalExpensesAmount

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">💰 CotiManager</h1>
            <p className="text-gray-400 text-sm mt-1">Tableau de bord admin</p>
          </div>
          {/* Utilisation du composant client pour la déconnexion */}
          <SignOutButton />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Membres" value={totalMembers} icon="👥" />
          <StatCard
            label="Collecté ce mois"
            value={`${totalCollected.toLocaleString()} Ar`}
            icon="💵"
          />
          <StatCard
            label="Dépenses"
            value={`${totalExpensesAmount.toLocaleString()} Ar`}
            icon="📤"
          />
          <StatCard
            label="Solde"
            value={`${balance.toLocaleString()} Ar`}
            icon="🏦"
            highlight={balance >= 0 ? "green" : "red"}
          />
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NavCard
            href="/dashboard/members"
            title="Membres"
            description="Ajouter, modifier ou supprimer des membres"
            icon="👥"
          />
          <NavCard
            href="/dashboard/periods"
            title="Cotisations"
            description="Gérer les périodes et les paiements"
            icon="📅"
          />
          <NavCard
            href="/dashboard/expenses"
            title="Dépenses"
            description="Suivre les dépenses de la communauté"
            icon="📤"
          />
        </div>

      </div>
    </main>
  )
}

function StatCard({
  label,
  value,
  icon,
  highlight,
}: {
  label: string
  value: string | number
  icon: string
  highlight?: "green" | "red"
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-2">
      <p className="text-gray-400 text-sm">{icon} {label}</p>
      <p
        className={`text-2xl font-bold ${
          highlight === "green"
            ? "text-green-400"
            : highlight === "red"
            ? "text-red-400"
            : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  )
}

function NavCard({
  href,
  title,
  description,
  icon,
}: {
  href: string
  title: string
  description: string
  icon: string
}) {
  return (
    <Link
      href={href}
      className="bg-gray-900 border border-gray-800 hover:border-violet-500 rounded-2xl p-6 space-y-2 transition-all hover:-translate-y-1 block"
    >
      <p className="text-2xl">{icon}</p>
      <p className="font-semibold text-white">{title}</p>
      <p className="text-gray-400 text-sm">{description}</p>
    </Link>
  )
}