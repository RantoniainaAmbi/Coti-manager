import Link from "next/link"
import { Users, Wallet, ArrowDownRight, LayoutDashboard } from "lucide-react"
import SignOutButton from "@/app/dashboard/SignOutButton"

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-900 border-r border-gray-800 flex flex-col justify-between">

      {/* Top */}
      <div className="p-6 space-y-8">

        {/* Logo */}
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            CotiManager
          </h1>
          <p className="text-xs text-gray-400">Admin dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
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
      </div>

      {/* Bottom */}
      <div className="p-6 border-t border-gray-800 space-y-4">
        <SignOutButton />
        <p className="text-xs text-gray-500 text-center">
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
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-all group"
    >
      <span className="text-gray-500 group-hover:text-white transition">
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  )
}