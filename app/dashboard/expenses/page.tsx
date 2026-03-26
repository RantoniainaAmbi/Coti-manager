import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import ExpensesClient from "./ExpensesClient"

export default async function ExpensesPage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const expenses = await prisma.expense.findMany({
    orderBy: { date: "desc" },
  })

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Dépenses
          </h1>
          <p className="text-sm text-gray-400">
            Suivi et gestion des dépenses
          </p>
        </div>
      </div>
 
      <ExpensesClient expenses={expenses} />

    </div>
  )
}