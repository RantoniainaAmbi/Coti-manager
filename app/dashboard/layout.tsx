import Sidebar from "@/components/Sidebar"
import MobileMenu from "@/components/MobileMenu"
import { Toaster } from "sonner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex">
      <Toaster
        position="top-right"
        richColors
        theme="dark"
        closeButton
        expand
        duration={3500}
      />

      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 md:p-8">
        <MobileMenu />
        {children}
      </div>
    </main>
  )
}