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
    <div className="space-y-8">

      <div>
        <a href="/dashboard" className="text-gray-500 hover:text-white text-sm transition-colors">
          ← Dashboard
        </a>
        <h1 className="text-3xl font-bold mt-1">👥 Membres</h1>
      </div>

      <MembersClient members={members} />

    </div>
  )
}