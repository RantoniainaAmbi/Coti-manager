import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { label, amount, date } = await req.json()

  const expense = await prisma.expense.create({
    data: { label, amount, date: new Date(date) },
  })

  return NextResponse.json(expense)
}