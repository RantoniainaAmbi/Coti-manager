import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import MembersClient from "./MembersClient"

export default async function MembersPage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const members = await prisma.member.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">

        <div className="flex items-center justify-between">
          <div>
            <a href="/dashboard" className="text-gray-500 hover:text-white text-sm transition-colors">
              ← Dashboard
            </a>
            <h1 className="text-3xl font-bold mt-1">👥 Membres</h1>
          </div>
        </div>

        <MembersClient members={members} />

      </div>
    </main>
  )
}