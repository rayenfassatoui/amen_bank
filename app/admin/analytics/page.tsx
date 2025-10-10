"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RequestStatsChart } from "@/components/dashboard/request-stats-chart"
import { Skeleton } from "@/components/ui/skeleton"
import { REQUEST_STATUSES } from "@/lib/constants/denominations"
import { ArrowLeft } from "lucide-react"

interface AnalyticsData {
  statusBreakdown: { name: string; value: number; color: string }[]
  typeBreakdown: { name: string; value: number; color: string }[]
  agencyBreakdown: { name: string; value: number }[]
  monthlyTrend: { name: string; value: number }[]
  totalAmount: number
  averageAmount: number
  averageProcessingTime: number
}

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/requests?limit=1000")
      const result = await response.json()

      if (response.ok) {
        const requests = result.data

        // Status breakdown
        const statusCounts = REQUEST_STATUSES.map(status => ({
          name: status.label,
          value: requests.filter((r: any) => r.status === status.value).length,
          color: getStatusColor(status.color),
        }))

        // Type breakdown
        const typeCounts = [
          {
            name: "Provisionnement",
            value: requests.filter((r: any) => r.requestType === "PROVISIONNEMENT").length,
            color: "rgb(139, 195, 74)",
          },
          {
            name: "Versement",
            value: requests.filter((r: any) => r.requestType === "VERSEMENT").length,
            color: "rgb(33, 150, 243)",
          },
        ]

        // Agency breakdown
        const agencyCounts: Record<string, number> = {}
        requests.forEach((r: any) => {
          const key = r.agency.name
          agencyCounts[key] = (agencyCounts[key] || 0) + 1
        })
        const agencyBreakdown = Object.entries(agencyCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5)

        // Monthly trend (last 6 months)
        const monthlyData: Record<string, number> = {}
        const now = new Date()
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
          const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
          monthlyData[monthKey] = 0
        }

        requests.forEach((r: any) => {
          const date = new Date(r.createdAt)
          const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
          if (monthlyData[monthKey] !== undefined) {
            monthlyData[monthKey]++
          }
        })

        const monthlyTrend = Object.entries(monthlyData).map(([name, value]) => ({ name, value }))

        // Calculate totals and averages
        const totalAmount = requests.reduce((sum: number, r: any) => sum + Number(r.totalAmount), 0)
        const averageAmount = requests.length > 0 ? totalAmount / requests.length : 0

        setAnalytics({
          statusBreakdown: statusCounts,
          typeBreakdown: typeCounts,
          agencyBreakdown,
          monthlyTrend,
          totalAmount,
          averageAmount,
          averageProcessingTime: 0, // TODO: Calculate based on action logs
        })
      } else {
        toast.error(result.message || "Failed to fetch analytics")
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
      toast.error("Failed to load analytics data")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (colorName: string) => {
    const colors: Record<string, string> = {
      blue: "rgb(33, 150, 243)",
      green: "rgb(76, 175, 80)",
      red: "rgb(244, 67, 54)",
      yellow: "rgb(255, 193, 7)",
      purple: "rgb(156, 39, 176)",
      gray: "rgb(158, 158, 158)",
    }
    return colors[colorName] || colors.gray
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
        <p className="text-gray-500">No analytics data available</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Analytics Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Comprehensive insights into fund management operations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Request Amount</CardTitle>
            <CardDescription>All-time total</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[rgb(var(--amen-green))]">
              {analytics.totalAmount.toFixed(3)} TND
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Request Amount</CardTitle>
            <CardDescription>Per request</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[rgb(var(--amen-blue))]">
              {analytics.averageAmount.toFixed(3)} TND
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Requests</CardTitle>
            <CardDescription>All-time count</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">
              {analytics.statusBreakdown.reduce((sum, item) => sum + item.value, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RequestStatsChart
          data={analytics.statusBreakdown}
          title="Requests by Status"
          description="Distribution of requests across different statuses"
          type="pie"
        />

        <RequestStatsChart
          data={analytics.typeBreakdown}
          title="Requests by Type"
          description="Provisionnement vs Versement"
          type="pie"
        />

        <RequestStatsChart
          data={analytics.monthlyTrend}
          title="Monthly Request Trend"
          description="Request volume over the last 6 months"
          type="bar"
        />

        <RequestStatsChart
          data={analytics.agencyBreakdown}
          title="Top 5 Agencies by Request Volume"
          description="Most active agencies"
          type="bar"
        />
      </div>
    </div>
  )
}