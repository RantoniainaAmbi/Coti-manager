"use client"

import { signOut } from "next-auth/react"

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-sm text-gray-500 hover:text-red-400 transition-colors border border-gray-700 hover:border-red-800 px-4 py-2 rounded-lg"
    >
      Déconnexion
    </button>
  )
}