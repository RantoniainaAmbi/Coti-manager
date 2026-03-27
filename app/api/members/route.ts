import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const { name, pseudo, email, password } = await req.json()

    // 1. Vérification de l'existence
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 400 })
    }

    // 2. Récupérer les périodes auxquelles on veut ajouter le membre
    const allPeriods = await prisma.period.findMany({
      select: { id: true }
    })

    const hashedPassword = await bcrypt.hash(password, 10)

    // 3. Création atomique (User + Member + Contributions)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "MEMBER",
        member: {
          create: { 
            name, 
            pseudo,
            contributions: {
              create: allPeriods.map((period) => ({
                periodId: period.id,
                status: "PENDING",
              })),
            },
          },
        },
      },
      include: {
        member: true
      }
    })

    return NextResponse.json(user)
  } catch (error: unknown) {
    console.error("[MEMBER_CREATE_ERROR]", error)
    return NextResponse.json(
      { error: "Erreur lors de la création du membre" }, 
      { status: 500 }
    )
  }
}