import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const { id } = await params
    const { name, pseudo } = await req.json()

    const updatedMember = await prisma.member.update({
      where: { id },
      data: { name, pseudo },
    })

    return NextResponse.json(updatedMember)
  } catch (error) {
    console.error("[MEMBER_UPDATE]", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 })
  }
}


export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const { id } = await params

  
    await prisma.member.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Membre supprimé avec succès" })
  } catch (error) {
    console.error("[MEMBER_DELETE]", error)
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
  }
}