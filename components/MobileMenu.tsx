"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import Sidebar from "./Sidebar"

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="md:hidden flex justify-between mb-4">
        <h1>CotiManager</h1>
        <button onClick={() => setOpen(true)}>
          <Menu />
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 z-50 transform transition ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>
    </>
  )
}