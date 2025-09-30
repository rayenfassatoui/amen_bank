"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  LogOut,
  Users,
  LayoutDashboard,
  FileText,
  Building2,
  Shield,
  TrendingUp,
  BarChart3,
  Activity,
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["Administrator", "Agency", "Central Cash", "Tunisia Security"],
    },
    {
      name: "Fund Requests",
      href: "/requests",
      icon: FileText,
      roles: ["Agency", "Central Cash", "Tunisia Security", "Administrator"],
    },
    {
      name: "User Management",
      href: "/admin/users",
      icon: Users,
      roles: ["Administrator"],
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
      roles: ["Administrator"],
    },
    {
      name: "Audit Logs",
      href: "/admin/audit-logs",
      icon: Activity,
      roles: ["Administrator"],
    },
    {
      name: "Agencies",
      href: "/agencies",
      icon: Building2,
      roles: ["Administrator", "Central Cash"],
    },
  ]

  const visibleItems = navigationItems.filter((item) =>
    item.roles.includes(session?.user.role || "")
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/logo_amen_bank.png"
                alt="Amen Bank"
                width={120}
                height={48}
                priority
              />
              <div className="h-8 w-px bg-gray-300" />
              <h1 className="text-lg font-semibold text-gray-900">
                Fund Management System
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {session?.user.name}
                </p>
                <p className="text-xs text-gray-500">{session?.user.role}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-[rgb(var(--accent))] hover:text-[rgb(var(--amen-green-dark))] transition-colors"
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Info Card */}
          <div className="p-4 m-4 bg-gradient-to-br from-[rgb(var(--amen-green-light))] to-[rgb(var(--amen-blue-light))] rounded-lg">
            <div className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5" />
              <div>
                <p className="text-xs font-medium">Agency</p>
                <p className="text-sm font-bold">{session?.user.agencyName}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}