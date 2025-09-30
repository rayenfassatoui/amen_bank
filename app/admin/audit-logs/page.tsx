"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"

interface AuditLog {
  id: string
  action: string
  performedBy: string
  details: string | null
  createdAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  } | null
  request: {
    id: string
    requestType: string
    status: string
    totalAmount: number
  } | null
}

export default function AuditLogsPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
    hasMore: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    action: "",
    dateFrom: "",
    dateTo: "",
  })

  useEffect(() => {
    fetchAuditLogs()
  }, [searchParams])

  const fetchAuditLogs = async () => {
    try {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        }
      })

      const response = await fetch(`/api/audit-logs?${params.toString()}`)
      const result = await response.json()

      if (response.ok) {
        setLogs(result.data)
        setPagination(result.pagination)
      } else {
        toast.error(result.message || "Failed to fetch audit logs")
      }
    } catch (error) {
      console.error("Error fetching audit logs:", error)
      toast.error("Failed to load audit logs")
    } finally {
      setIsLoading(false)
    }
  }

  if (session?.user.role !== "Administrator") {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600">You don't have permission to view audit logs.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Audit Logs</h1>
        <Skeleton className="h-[600px]" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-gray-600 mt-2">Comprehensive system activity tracking</p>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="action">Action</Label>
            <Input
              id="action"
              placeholder="Search actions..."
              value={filters.action}
              onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateFrom">Date From</Label>
            <Input
              id="dateFrom"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateTo">Date To</Label>
            <Input
              id="dateTo"
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={fetchAuditLogs}>Apply Filters</Button>
          <Button
            variant="outline"
            onClick={() => {
              setFilters({ action: "", dateFrom: "", dateTo: "" })
              fetchAuditLogs()
            }}
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Audit Logs Table */}
      <Card className="p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {logs.length} of {pagination.total} logs
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Performed By</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Request ID</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No audit logs found
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-[rgb(var(--amen-green))]">
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell>{log.performedBy}</TableCell>
                    <TableCell>
                      {log.user ? (
                        <div>
                          <p className="font-medium">{log.user.firstName} {log.user.lastName}</p>
                          <p className="text-xs text-gray-500">{log.user.email}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">System</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {log.request ? (
                        <span className="font-mono text-sm">{log.request.id.slice(0, 8)}...</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="text-sm text-gray-600 truncate">
                        {log.details || "-"}
                      </p>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          hasMore={pagination.hasMore}
        />
      </Card>
    </div>
  )
}