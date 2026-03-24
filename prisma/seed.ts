import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL,
    },
  },
})

async function main() {
  const password = await bcrypt.hash("admin123", 10)

  await prisma.user.upsert({
    where: { email: "admin@cotimanager.com" },
    update: {},
    create: {
      email: "admin@cotimanager.com",
      password,
      role: "ADMIN",
    },
  })

  console.log(" Admin créé : admin@cotimanager.com / admin123")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())