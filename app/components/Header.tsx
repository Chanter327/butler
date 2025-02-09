"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MessageSquare, CheckSquare, LineChart, LayoutDashboard, User, LogOut, FileText, Menu } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const navItems = [
  { name: "ダッシュボード", href: "/dashboard", icon: LayoutDashboard },
  { name: "チャット", href: "/chat", icon: MessageSquare },
  // { name: "タスク", href: "/tasks", icon: CheckSquare },
  { name: "要約", href: "/summary", icon: FileText },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [username, setUsername] = useState<string | null>(() => {
    // クライアントサイドでのみ実行されるように
    if (typeof window !== 'undefined') {
      return localStorage.getItem("userName")
    }
    return null
  })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const updateUsername = (event: CustomEvent) => {
      setUsername(event.detail)
    }

    window.addEventListener('userNameUpdated', updateUsername as EventListener)

    return () => {
      window.removeEventListener('userNameUpdated', updateUsername as EventListener)
    }
  }, [])

  const handleSignOut = () => {
    localStorage.clear()
    setUsername(null)
    router.push("/")
  }

  const NavItems = ({ mobile = false }) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <Link key={item.name} href={item.href} passHref>
            <Button
              variant={pathname === item.href ? "default" : "ghost"}
              className={`flex items-center space-x-2 ${mobile ? "w-full justify-start" : ""}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Button>
          </Link>
        )
      })}
    </>
  )

  if (pathname === "/" || pathname === "/signup") {
    return
  } else {
    return (
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard">
                <span className="text-2xl font-bold text-gray-900">Butler</span>
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-4">
            <NavItems />
              {/* {navItems.map((item) => {
              //   const Icon = item.icon
              //   return (
              //     <Link key={item.name} href={item.href}>
              //       <Button
              //         variant={pathname === item.href ? "default" : "ghost"}
              //         className="flex items-center space-x-2"
              //       >
              //         <Icon className="h-5 w-5" />
              //         <span>{item.name}</span>
              //       </Button>
              //     </Link>
              //   )
              // })} */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span className="text-sm">{username || "ユーザー"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>サインアウト</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
            <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-4">
                  <NavItems mobile />
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 w-full justify-start"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>サインアウト</span>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          </div>
        </div>
      </header>
    )
  }
}

