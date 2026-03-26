import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import PeriodsClient from "./PeriodsClient"

export default async function PeriodsPage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const periods = await prisma.period.findMany({
    orderBy: [{ year: "desc" }, { month: "desc" }],
    include: {
      contributions: {
        include: { member: true },
      },
    },
  })

  const members = await prisma.member.findMany({
    orderBy: { name: "asc" },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Cotisations</h1>
        <p className="text-sm text-gray-400">
          Gestion des périodes et paiements
        </p>
      </div>

      <PeriodsClient periods={periods} members={members} />
    </div>
  )
}