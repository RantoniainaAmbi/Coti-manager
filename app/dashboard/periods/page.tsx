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
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <a href="/dashboard" className="text-gray-500 hover:text-white text-sm transition-colors">
            ← Dashboard
          </a>
          <h1 className="text-3xl font-bold mt-1">📅 Cotisations</h1>
        </div>
        <PeriodsClient periods={periods} members={members} />
      </div>
    </main>
  )
}