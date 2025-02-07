"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageSquare, CheckSquare, LineChart, LayoutDashboard } from "lucide-react"

export default function Header() {
  const pathname = usePathname()

  const navItems = [
    { name: "ダッシュボード", href: "/dashboard", icon: LayoutDashboard },
    { name: "チャット", href: "/chat", icon: MessageSquare },
    { name: "タスク", href: "/tasks", icon: CheckSquare },
    { name: "インサイト", href: "/insights", icon: LineChart },
  ]

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard">
              <span className="text-2xl font-bold text-gray-900">Butler</span>
            </Link>
          </div>
          <nav className="flex space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={pathname === item.href ? "default" : "ghost"}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}

