import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

import MemberHeader from "@/components/member/MemberHeader"
import MemberProgress from "@/components/member/MemberProgress"
import MemberStats from "@/components/member/MemberStats"
import MemberContributions from "@/components/member/MemberContributions"

export default async function Page() {
  const session = await auth()
  if (!session) redirect("/login")

  const user = session.user as { id: string; role: string }

  if (user.role === "ADMIN") redirect("/dashboard")

  const member = await prisma.member.findUnique({
    where: { userId: user.id },
    include: {
      contributions: {
        include: { period: true },
        orderBy: [
          { period: { year: "desc" } },
          { period: { month: "desc" } },
        ],
      },
    },
  })

  if (!member) redirect("/login")

  const expenses = await prisma.expense.findMany()

  const allPaid = await prisma.contribution.findMany({
    where: { status: "PAID" },
    include: { period: true },
  })

  const totalPaid = member.contributions
    .filter((c) => c.status === "PAID")
    .reduce((s, c) => s + c.period.amount, 0)

  const totalPending = member.contributions
    .filter((c) => c.status !== "PAID")
    .reduce((s, c) => s + c.period.amount, 0)

  const totalCollected = allPaid.reduce((s, c) => s + c.period.amount, 0)
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const balance = totalCollected - totalExpenses

  const progress =
    totalPaid + totalPending === 0
      ? 0
      : Math.round((totalPaid / (totalPaid + totalPending)) * 100)

  return (
    <main className="p-6 space-y-8">

      <MemberHeader
        name={member.name}
        pseudo={member.pseudo}
      />

      <MemberProgress
        progress={progress}
        pending={totalPending}
      />

      <MemberStats
        paid={totalPaid}
        pending={totalPending}
        expenses={totalExpenses}
        balance={balance}
      />

      <MemberContributions
        contributions={member.contributions}
      />

    </main>
  )
}