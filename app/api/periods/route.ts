import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { month, year, amount, memberIds } = await req.json()

  const existing = await prisma.period.findUnique({
    where: { month_year: { month, year } },
  })

  if (existing) {
    return NextResponse.json({ error: "Cette période existe déjà" }, { status: 400 })
  }

  const period = await prisma.period.create({
    data: {
      month,
      year,
      amount,
      contributions: {
        create: memberIds.map((memberId: string) => ({
          memberId,
          status: "PENDING",
        })),
      },
    },
  })

  return NextResponse.json(period)
}