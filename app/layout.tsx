import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "next-auth/react"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CotiManager",
  description: "Gestion des cotisations de votre communauté",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${geist.className} antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}