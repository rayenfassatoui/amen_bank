"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { Users, FileText, Building2, CheckCircle, Clock, AlertCircle, Truck } from "lucide-react"
import { toast } from "sonner"

interface DashboardStats {
  totalRequests: number
  pendingRequests: number
  validatedRequests: number
  dispatchedRequests: number
  completedRequests: number
  rejectedRequests: number
  totalUsers: number
  totalAgencies: number
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    pendingRequests: 0,
    validatedRequests: 0,
    dispatchedRequests: 0,
    completedRequests: 0,
    rejectedRequests: 0,
    totalUsers: 0,
    totalAgencies: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const [requestsRes, usersRes, agenciesRes] = await Promise.all([
        fetch("/api/requests"),
        session?.user.role === "Administrator" ? fetch("/api/users") : Promise.resolve({ ok: false }),
        fetch("/api/agencies")
      ])

      if (requestsRes.ok) {
        const requestsData = await requestsRes.json()
        const requests = requestsData.data || []

        setStats(prev => ({
          ...prev,
          totalRequests: requests.length,
          pendingRequests: requests.filter((r: any) => r.status === "SUBMITTED").length,
          validatedRequests: requests.filter((r: any) => r.status === "VALIDATED" || r.status === "ASSIGNED").length,
          dispatchedRequests: requests.filter((r: any) => r.status === "DISPATCHED").length,
          completedRequests: requests.filter((r: any) => r.status === "RECEIVED" || r.status === "COMPLETED").length,
          rejectedRequests: requests.filter((r: any) => r.status === "REJECTED").length
        }))
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setStats(prev => ({ ...prev, totalUsers: usersData.data?.length || 0 }))
      }

      if (agenciesRes.ok) {
        const agenciesData = await agenciesRes.json()
        setStats(prev => ({ ...prev, totalAgencies: agenciesData.data?.length || 0 }))
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      toast.error("Failed to load dashboard statistics")
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleSpecificCards = () => {
    const role = session?.user.role

    if (role === "Administrator") {
      return (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <FileText className="h-4 w-4 text-[rgb(var(--amen-blue))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRequests}</div>
              <p className="text-xs text-gray-500">
                {stats.completedRequests} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-[rgb(var(--amen-green))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-gray-500">
                Across all roles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agencies</CardTitle>
              <Building2 className="h-4 w-4 text-[rgb(var(--amen-blue))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAgencies}</div>
              <p className="text-xs text-gray-500">
                Across Tunisia
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-[rgb(var(--amen-green))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalRequests > 0
                  ? ((stats.completedRequests / stats.totalRequests) * 100).toFixed(1)
                  : 0}%
              </div>
              <p className="text-xs text-gray-500">
                Request completion rate
              </p>
            </CardContent>
          </Card>
        </>
      )
    }

    if (role === "Agency") {
      return (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Requests</CardTitle>
              <FileText className="h-4 w-4 text-[rgb(var(--amen-blue))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRequests}</div>
              <p className="text-xs text-gray-500">
                Total submitted
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingRequests}</div>
              <p className="text-xs text-gray-500">
                Awaiting validation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Transit</CardTitle>
              <Truck className="h-4 w-4 text-[rgb(var(--amen-blue))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.dispatchedRequests}</div>
              <p className="text-xs text-gray-500">
                Being delivered
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-[rgb(var(--amen-green))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedRequests}</div>
              <p className="text-xs text-gray-500">
                Successfully received
              </p>
            </CardContent>
          </Card>
        </>
      )
    }

    if (role === "Central Cash") {
      return (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Validation</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingRequests}</div>
              <p className="text-xs text-gray-500">
                Requires your review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Validated</CardTitle>
              <CheckCircle className="h-4 w-4 text-[rgb(var(--amen-green))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.validatedRequests}</div>
              <p className="text-xs text-gray-500">
                Approved requests
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rejectedRequests}</div>
              <p className="text-xs text-gray-500">
                Denied requests
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <FileText className="h-4 w-4 text-[rgb(var(--amen-blue))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRequests}</div>
              <p className="text-xs text-gray-500">
                All time
              </p>
            </CardContent>
          </Card>
        </>
      )
    }

    if (role === "Tunisia Security") {
      return (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ready for Assignment</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.validatedRequests}
              </div>
              <p className="text-xs text-gray-500">
                Awaiting team assignment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dispatched</CardTitle>
              <Truck className="h-4 w-4 text-[rgb(var(--amen-blue))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.dispatchedRequests}</div>
              <p className="text-xs text-gray-500">
                Currently in transit
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-[rgb(var(--amen-green))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedRequests}</div>
              <p className="text-xs text-gray-500">
                Successfully delivered
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <FileText className="h-4 w-4 text-[rgb(var(--amen-blue))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRequests}</div>
              <p className="text-xs text-gray-500">
                All time
              </p>
            </CardContent>
          </Card>
        </>
      )
    }

    return null
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <p>Loading dashboard...</p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Welcome back, {session?.user.firstName}!
            </h2>
            <p className="text-gray-500 mt-2">
              Here's what's happening with your fund management system today.
            </p>
          </div>

          {/* Role-Specific Stats Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {getRoleSpecificCards()}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks for your role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {session?.user.role === "Agency" && (
                  <a href="/requests/create" className="block p-3 bg-[rgb(var(--amen-green))] text-white rounded-lg hover:opacity-90 transition">
                    Create New Request
                  </a>
                )}
                {session?.user.role === "Central Cash" && (
                  <a href="/central-cash" className="block p-3 bg-[rgb(var(--amen-blue))] text-white rounded-lg hover:opacity-90 transition">
                    Review Pending Requests
                  </a>
                )}
                {session?.user.role === "Tunisia Security" && (
                  <a href="/tunisia-security" className="block p-3 bg-[rgb(var(--amen-blue))] text-white rounded-lg hover:opacity-90 transition">
                    Manage Assignments & Dispatch
                  </a>
                )}
                {session?.user.role === "Administrator" && (
                  <a href="/admin/users" className="block p-3 bg-[rgb(var(--amen-green))] text-white rounded-lg hover:opacity-90 transition">
                    Manage Users
                  </a>
                )}
                <a href="/requests" className="block p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  View All Requests
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}