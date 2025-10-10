"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination } from "@/components/ui/pagination"
import { RequestFilters } from "@/components/requests/request-filters"
import { REQUEST_STATUSES } from "@/lib/constants/denominations"
import { ArrowLeft } from "lucide-react"

interface Request {
  id: string
  requestType: string
  status: string
  totalAmount: number
  teamAssigned: string | null
  dispatchedAt: string | null
  receivedAt: string | null
  createdAt: string
  agency: {
    id: string
    name: string
    code: string
    city: string
  }
  user: {
    firstName: string
    lastName: string
    email: string
  }
}

export default function RequestsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [requests, setRequests] = useState<Request[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasMore: false,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [searchParams])

  const fetchRequests = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams(searchParams.toString())
      const response = await fetch(`/api/requests?${params.toString()}`)
      const result = await response.json()

      if (response.ok) {
        setRequests(result.data)
        setPagination(result.pagination)
      } else {
        toast.error(result.message || "Failed to fetch requests")
      }
    } catch (error) {
      console.error("Error fetching requests:", error)
      toast.error("Failed to fetch requests")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusInfo = REQUEST_STATUSES.find(s => s.value === status)
    const colorClasses: Record<string, string> = {
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      red: "bg-red-100 text-red-800",
      yellow: "bg-yellow-100 text-yellow-800",
      purple: "bg-purple-100 text-purple-800",
      gray: "bg-gray-100 text-gray-800"
    }
    const colorClass = colorClasses[statusInfo?.color || "gray"]

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {statusInfo?.label || status}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">Fund Requests</h1>
        <Skeleton className="h-[600px]" />
      </div>
    )
  }

  const canCreateRequest = session?.user?.role === "Agency"

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
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
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Fund Requests</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">View and manage all fund transfer requests</p>
        </div>
        {canCreateRequest && (
          <Button onClick={() => router.push("/requests/create")}>
            Create New Request
          </Button>
        )}
      </div>

      <RequestFilters onFilterChange={fetchRequests} />

      <Card className="p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {requests.length} of {pagination.total} requests
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No requests found</p>
            {canCreateRequest && (
              <Button className="mt-4" onClick={() => router.push("/requests/create")}>
                Create Your First Request
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Agency</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount (TND)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-mono text-sm">{request.id.slice(0, 8)}...</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.agency.name}</p>
                        <p className="text-sm text-gray-500">{request.agency.code}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium ${
                        request.requestType === "PROVISIONNEMENT"
                          ? "text-[rgb(var(--amen-green))]"
                          : "text-[rgb(var(--amen-blue))]"
                      }`}>
                        {request.requestType}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold">{Number(request.totalAmount).toFixed(3)}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      {request.teamAssigned ? (
                        <span className="text-sm font-medium">{request.teamAssigned}</span>
                      ) : (
                        <span className="text-sm text-gray-400">Not assigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/requests/${request.id}`)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          hasMore={pagination.hasMore}
        />
      </Card>
    </div>
  )
}