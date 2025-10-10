"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { REQUEST_STATUSES } from "@/lib/constants/denominations"
import { AssignTeamDialog } from "@/components/assign-team-dialog"

interface Request {
  id: string
  requestType: string
  status: string
  totalAmount: number
  securityTeam?: {
    teamName: string
    cinChauffeur: string
    cinTransporteur: string
  } | null
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

export default function TunisiaSecurityPage() {
  const { data: session } = useSession()
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/requests")
      const result = await response.json()

      if (response.ok) {
        setRequests(result.data)
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

  const handleAssignSuccess = () => {
    fetchRequests()
  }

  const handleDispatch = async (requestId: string) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/requests/${requestId}/dispatch`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          dispatchedBy: session?.user?.name || session?.user?.email || "Tunisia Security"
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to dispatch request")
      }

      toast.success("Request dispatched successfully!")
      fetchRequests()
    } catch (error) {
      console.error("Error dispatching request:", error)
      toast.error(error instanceof Error ? error.message : "Failed to dispatch request")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusInfo = REQUEST_STATUSES.find(s => s.value === status)
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${statusInfo?.color || "gray"}-100 text-${statusInfo?.color || "gray"}-800`}>
        {statusInfo?.label || status}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tunisia Security Dashboard</h1>
          <p className="text-gray-600 mt-2">Assign teams and dispatch validated requests</p>
        </div>
        <Button 
          onClick={() => window.location.href = '/dashboard'}
          variant="outline"
          className="flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7"/>
            <path d="M19 12H5"/>
          </svg>
          Back to Dashboard
        </Button>
      </div>

      {/* Validated Requests - Need Assignment */}
      <Card className="p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-[rgb(var(--amen-green))]">Pending Team Assignment</h2>
          <p className="text-sm text-gray-600">
            Showing {requests.filter(r => r.status === "VALIDATED").length} validated requests
          </p>
        </div>

        {requests.filter(r => r.status === "VALIDATED").length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No requests pending team assignment</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Agency</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount (TND)</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.filter(r => r.status === "VALIDATED").map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-mono text-sm">{request.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.agency.name}</p>
                      <p className="text-sm text-gray-500">{request.agency.code} - {request.agency.city}</p>
                    </div>
                  </TableCell>
                  <TableCell>{request.requestType}</TableCell>
                  <TableCell className="font-semibold">{Number(request.totalAmount).toFixed(3)}</TableCell>
                  <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedRequestId(request.id)
                        setAssignDialogOpen(true)
                      }}
                      disabled={isSubmitting}
                    >
                      Assign Team
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Assigned Requests - Ready for Dispatch */}
      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-[rgb(var(--amen-blue))]">Ready for Dispatch</h2>
          <p className="text-sm text-gray-600">
            Showing {requests.filter(r => r.status === "ASSIGNED").length} assigned requests
          </p>
        </div>

        {requests.filter(r => r.status === "ASSIGNED").length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No requests ready for dispatch</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Agency</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount (TND)</TableHead>
                <TableHead>Team Assigned</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.filter(r => r.status === "ASSIGNED").map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-mono text-sm">{request.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.agency.name}</p>
                      <p className="text-sm text-gray-500">{request.agency.code} - {request.agency.city}</p>
                    </div>
                  </TableCell>
                  <TableCell>{request.requestType}</TableCell>
                  <TableCell className="font-semibold">{Number(request.totalAmount).toFixed(3)}</TableCell>
                  <TableCell>
                    {request.securityTeam ? (
                      <div>
                        <p className="font-medium text-[rgb(var(--amen-green))]">{request.securityTeam.teamName}</p>
                        <p className="text-xs text-gray-500">Chauffeur: {request.securityTeam.cinChauffeur}</p>
                        <p className="text-xs text-gray-500">Transporteur: {request.securityTeam.cinTransporteur}</p>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => handleDispatch(request.id)}
                      disabled={isSubmitting}
                    >
                      Dispatch
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {selectedRequestId && (
        <AssignTeamDialog
          open={assignDialogOpen}
          onOpenChange={setAssignDialogOpen}
          requestId={selectedRequestId}
          onSuccess={handleAssignSuccess}
        />
      )}
    </div>
  )
}