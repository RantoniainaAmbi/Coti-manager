import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function DELETE(
  req: Request,
  { params }: RouteParams 
) {
  const session = await auth()
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 })
    }

    await prisma.period.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Période supprimée" })
  } catch (error: unknown) {
    console.error("[PERIOD_DELETE]", error)
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: RouteParams
) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const { id } = await params
    const { month, year, amount } = await req.json()

    const updatedPeriod = await prisma.period.update({
      where: { id },
      data: { 
        month: Number(month), 
        year: Number(year), 
        amount: Number(amount) 
      },
    })

    return NextResponse.json(updatedPeriod)
  } catch (error: unknown) {
    console.error("[PERIOD_PATCH]", error)
    return NextResponse.json({ error: "Erreur lors de la modification" }, { status: 500 })
  }
}