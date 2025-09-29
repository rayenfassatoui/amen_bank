"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { REQUEST_STATUSES } from "@/lib/constants/denominations"

interface Request {
  id: string
  requestType: string
  status: string
  totalAmount: number
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

export default function CentralCashPage() {
  const { data: session } = useSession()
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
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

  const handleValidate = async (requestId: string) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/requests/${requestId}/validate`, {
        method: "PATCH"
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to validate request")
      }

      toast.success("Request validated successfully!")
      fetchRequests()
    } catch (error) {
      console.error("Error validating request:", error)
      toast.error(error instanceof Error ? error.message : "Failed to validate request")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRejectSubmit = async () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/requests/${selectedRequest.id}/reject`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reason: rejectionReason })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to reject request")
      }

      toast.success("Request rejected successfully!")
      setRejectDialogOpen(false)
      setSelectedRequest(null)
      setRejectionReason("")
      fetchRequests()
    } catch (error) {
      console.error("Error rejecting request:", error)
      toast.error(error instanceof Error ? error.message : "Failed to reject request")
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Central Cash Dashboard</h1>
        <p className="text-gray-600 mt-2">Validate or reject fund requests from agencies</p>
      </div>

      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Pending Validation</h2>
          <p className="text-sm text-gray-600">
            Showing {requests.filter(r => r.status === "SUBMITTED").length} submitted requests
          </p>
        </div>

        {requests.filter(r => r.status === "SUBMITTED").length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No pending requests to validate</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Agency</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount (TND)</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.filter(r => r.status === "SUBMITTED").map((request) => (
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
                    <div>
                      <p className="font-medium">{request.user.firstName} {request.user.lastName}</p>
                      <p className="text-sm text-gray-500">{request.user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleValidate(request.id)}
                        disabled={isSubmitting}
                      >
                        Validate
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedRequest(request)
                          setRejectDialogOpen(true)
                        }}
                        disabled={isSubmitting}
                      >
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason *</Label>
              <Input
                id="reason"
                placeholder="Enter rejection reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setRejectDialogOpen(false)
                  setRejectionReason("")
                  setSelectedRequest(null)
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectSubmit}
                disabled={isSubmitting || !rejectionReason.trim()}
              >
                {isSubmitting ? "Rejecting..." : "Reject Request"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}