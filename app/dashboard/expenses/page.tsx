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
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <a href="/dashboard" className="text-gray-500 hover:text-white text-sm transition-colors">
            ← Dashboard
          </a>
          <h1 className="text-3xl font-bold mt-1">📤 Dépenses</h1>
        </div>
        <ExpensesClient expenses={expenses} />
      </div>
    </main>
  )
}