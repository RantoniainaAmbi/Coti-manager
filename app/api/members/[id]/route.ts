import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { id } = await params

  const member = await prisma.member.findUnique({
    where: { id },
  })

  if (!member) {
    return NextResponse.json({ error: "Membre introuvable" }, { status: 404 })
  }

  await prisma.user.delete({ where: { id: member.userId } })

  return NextResponse.json({ success: true })
}