"use client"

import Link from "next/link"
import { Users, Wallet, ArrowDownRight, LayoutDashboard } from "lucide-react"
import SignOutButton from "@/app/dashboard/SignOutButton"
import { usePathname } from "next/navigation" 

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-900 border-r border-gray-800 flex flex-col sticky top-0">

      {/* Top / Logo - Reste fixe en haut */}
      <div className="p-6">
        <h1 className="text-lg font-semibold tracking-tight text-white">
          CotiManager
        </h1>
        <p className="text-xs text-gray-400">Admin dashboard</p>
      </div>

      {/* Navigation - Cette zone devient scrollable si elle est trop longue */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
        <SidebarItem
          href="/dashboard"
          icon={<LayoutDashboard size={16} />}
          label="Dashboard"
        />
        <SidebarItem
          href="/dashboard/members"
          icon={<Users size={16} />}
          label="Membres"
        />
        <SidebarItem
          href="/dashboard/periods"
          icon={<Wallet size={16} />}
          label="Cotisations"
        />
        <SidebarItem
          href="/dashboard/expenses"
          icon={<ArrowDownRight size={16} />}
          label="Dépenses"
        />
      </nav>

      {/* Bottom - Reste fixe en bas */}
      <div className="p-6 border-t border-gray-800 bg-gray-900">
        <SignOutButton />
        <p className="text-xs text-gray-500 text-center mt-4">
          © {new Date().getFullYear()} CotiManager
        </p>
      </div>

    </aside>
  )
}

type SidebarItemProps = {
  href: string
  icon: React.ReactNode
  label: string
}

function SidebarItem({ href, icon, label }: SidebarItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group ${
        isActive 
          ? "bg-violet-600/10 text-violet-400 font-medium" 
          : "text-gray-400 hover:text-white hover:bg-gray-800"
      }`}
    >
      <span className={`${isActive ? "text-violet-400" : "text-gray-500 group-hover:text-white"} transition`}>
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  )
}