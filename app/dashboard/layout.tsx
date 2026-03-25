import Sidebar from "@/components/Sidebar"
import MobileMenu from "@/components/MobileMenu"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex">

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Content */}
      <div className="flex-1 p-6 md:p-8">
        <MobileMenu />
        {children}
      </div>

    </main>
  )
}