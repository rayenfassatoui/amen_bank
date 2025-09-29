"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login")
      return
    }

    if (allowedRoles && !allowedRoles.includes(session.user.role)) {
      router.push("/unauthorized")
    }
  }, [session, status, router, allowedRoles])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(var(--amen-green))]"></div>
      </div>
    )
  }

  if (!session || (allowedRoles && !allowedRoles.includes(session.user.role))) {
    return null
  }

  return <>{children}</>
}