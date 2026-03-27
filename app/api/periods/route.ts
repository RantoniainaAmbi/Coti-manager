import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { month, year, amount, memberIds } = await req.json()

    // Vérification de l'existence (Prisma attend des nombres)
    const existing = await prisma.period.findUnique({
      where: { 
        month_year: { 
          month: Number(month), 
          year: Number(year) 
        } 
      },
    })

    if (existing) {
      return NextResponse.json({ error: "Cette période existe déjà" }, { status: 400 })
    }

    const period = await prisma.period.create({
      data: {
        month: Number(month),
        year: Number(year),
        amount: Number(amount),
        contributions: {
          create: memberIds.map((memberId: string) => ({
            memberId,
            status: "PENDING",
          })),
        },
      },
    })

    return NextResponse.json(period)
  } catch (error: unknown) {
    console.error("[PERIOD_POST_ERROR]:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création de la période." }, 
      { status: 500 }
    )
  }
}