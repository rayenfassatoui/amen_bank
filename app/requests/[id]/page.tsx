"use client"

import { use, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { REQUEST_STATUSES } from "@/lib/constants/denominations"

interface DenominationDetail {
  id: string
  denominationType: string
  denominationValue: number
  quantity: number
  totalValue: number
}

interface ActionLog {
  id: string
  action: string
  performedBy: string
  performedAt: string
  details: string | null
}

interface RequestDetail {
  id: string
  requestType: string
  status: string
  totalAmount: number
  teamAssigned: string | null
  dispatchedBy: string | null
  dispatchedAt: string | null
  receivedBy: string | null
  receivedAt: string | null
  nonCompliance: string | null
  nonComplianceDetails: string | null
  createdAt: string
  updatedAt: string
  agency: {
    id: string
    name: string
    code: string
    city: string
    address: string
  }
  user: {
    firstName: string
    lastName: string
    email: string
  }
  denominationDetails: DenominationDetail[]
  actionLogs: ActionLog[]
}

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { data: session } = useSession()
  const router = useRouter()
  const [request, setRequest] = useState<RequestDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Dialogs
  const [validateDialogOpen, setValidateDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false)

  // Form data
  const [rejectionReason, setRejectionReason] = useState("")
  const [teamName, setTeamName] = useState("")
  const [receivedBy, setReceivedBy] = useState("")
  const [password, setPassword] = useState("")
  const [nonCompliance, setNonCompliance] = useState<"YES" | "NO">("NO")
  const [nonComplianceDetails, setNonComplianceDetails] = useState("")

  useEffect(() => {
    fetchRequestDetails()
  }, [resolvedParams.id])

  const fetchRequestDetails = async () => {
    try {
      const response = await fetch(`/api/requests/${resolvedParams.id}`)
      const result = await response.json()

      if (response.ok) {
        setRequest(result.data)
      } else {
        toast.error(result.message || "Failed to fetch request details")
      }
    } catch (error) {
      console.error("Error fetching request details:", error)
      toast.error("Failed to fetch request details")
    } finally {
      setIsLoading(false)
    }
  }

  const handleValidate = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/requests/${resolvedParams.id}/validate`, {
        method: "PATCH"
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to validate request")
      }

      toast.success("Request validated successfully!")
      setValidateDialogOpen(false)
      fetchRequestDetails()
    } catch (error) {
      console.error("Error validating request:", error)
      toast.error(error instanceof Error ? error.message : "Failed to validate request")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/requests/${resolvedParams.id}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectionReason })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to reject request")
      }

      toast.success("Request rejected successfully!")
      setRejectDialogOpen(false)
      setRejectionReason("")
      fetchRequestDetails()
    } catch (error) {
      console.error("Error rejecting request:", error)
      toast.error(error instanceof Error ? error.message : "Failed to reject request")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAssign = async () => {
    if (!teamName.trim()) {
      toast.error("Please provide a team name")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/requests/${resolvedParams.id}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamAssigned: teamName })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to assign team")
      }

      toast.success("Team assigned successfully!")
      setAssignDialogOpen(false)
      setTeamName("")
      fetchRequestDetails()
    } catch (error) {
      console.error("Error assigning team:", error)
      toast.error(error instanceof Error ? error.message : "Failed to assign team")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDispatch = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/requests/${resolvedParams.id}/dispatch`, {
        method: "PATCH"
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to dispatch request")
      }

      toast.success("Request dispatched successfully!")
      fetchRequestDetails()
    } catch (error) {
      console.error("Error dispatching request:", error)
      toast.error(error instanceof Error ? error.message : "Failed to dispatch request")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReceive = async () => {
    if (!receivedBy.trim() || !password.trim()) {
      toast.error("Please provide all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/requests/${resolvedParams.id}/receive`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receivedBy,
          password,
          nonCompliance,
          nonComplianceDetails: nonCompliance === "YES" ? nonComplianceDetails : undefined
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to confirm receipt")
      }

      toast.success("Receipt confirmed successfully!")
      setReceiveDialogOpen(false)
      setReceivedBy("")
      setPassword("")
      setNonCompliance("NO")
      setNonComplianceDetails("")
      fetchRequestDetails()
    } catch (error) {
      console.error("Error confirming receipt:", error)
      toast.error(error instanceof Error ? error.message : "Failed to confirm receipt")
    } finally {
      setIsSubmitting(false)
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
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
        {statusInfo?.label || status}
      </span>
    )
  }

  const canValidate = session?.user?.role === "Central Cash" && request?.status === "SUBMITTED"
  const canReject = session?.user?.role === "Central Cash" && request?.status === "SUBMITTED"
  const canAssign = session?.user?.role === "Tunisia Security" && request?.status === "VALIDATED"
  const canDispatch = session?.user?.role === "Tunisia Security" && request?.status === "ASSIGNED"
  const canReceive = session?.user?.role === "Agency" && request?.status === "DISPATCHED"

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>Loading...</p>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>Request not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Request Details</h1>
          <p className="text-gray-600 mt-2 font-mono text-sm">ID: {request.id}</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Back to List
        </Button>
      </div>

      {/* Action Buttons */}
      {(canValidate || canReject || canAssign || canDispatch || canReceive) && (
        <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
          <div className="flex flex-wrap gap-3">
            {canValidate && (
              <Button onClick={() => setValidateDialogOpen(true)}>
                Validate Request
              </Button>
            )}
            {canReject && (
              <Button variant="destructive" onClick={() => setRejectDialogOpen(true)}>
                Reject Request
              </Button>
            )}
            {canAssign && (
              <Button onClick={() => setAssignDialogOpen(true)}>
                Assign Team
              </Button>
            )}
            {canDispatch && (
              <Button onClick={handleDispatch} disabled={isSubmitting}>
                {isSubmitting ? "Dispatching..." : "Dispatch Request"}
              </Button>
            )}
            {canReceive && (
              <Button onClick={() => setReceiveDialogOpen(true)}>
                Confirm Receipt
              </Button>
            )}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Request Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-[rgb(var(--amen-green))]">Request Information</h2>
          <div className="space-y-3">
            <div>
              <span className="text-gray-600">Type:</span>
              <span className="ml-2 font-medium">{request.requestType}</span>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <span className="ml-2">{getStatusBadge(request.status)}</span>
            </div>
            <div>
              <span className="text-gray-600">Total Amount:</span>
              <span className="ml-2 font-bold text-lg">{Number(request.totalAmount).toFixed(3)} TND</span>
            </div>
            <div>
              <span className="text-gray-600">Created:</span>
              <span className="ml-2">{new Date(request.createdAt).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-600">Last Updated:</span>
              <span className="ml-2">{new Date(request.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* Agency Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-[rgb(var(--amen-blue))]">Agency Information</h2>
          <div className="space-y-3">
            <div>
              <span className="text-gray-600">Name:</span>
              <span className="ml-2 font-medium">{request.agency.name}</span>
            </div>
            <div>
              <span className="text-gray-600">Code:</span>
              <span className="ml-2 font-mono">{request.agency.code}</span>
            </div>
            <div>
              <span className="text-gray-600">City:</span>
              <span className="ml-2">{request.agency.city}</span>
            </div>
            <div>
              <span className="text-gray-600">Address:</span>
              <span className="ml-2">{request.agency.address}</span>
            </div>
            <div>
              <span className="text-gray-600">Requested By:</span>
              <div className="ml-2">
                <p className="font-medium">{request.user.firstName} {request.user.lastName}</p>
                <p className="text-sm text-gray-500">{request.user.email}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Security & Dispatch Information */}
      {(request.teamAssigned || request.dispatchedBy || request.receivedBy) && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Security & Dispatch Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {request.teamAssigned && (
              <div>
                <span className="text-gray-600">Team Assigned:</span>
                <p className="font-medium">{request.teamAssigned}</p>
              </div>
            )}
            {request.dispatchedBy && (
              <div>
                <span className="text-gray-600">Dispatched By:</span>
                <p className="font-medium">{request.dispatchedBy}</p>
                {request.dispatchedAt && (
                  <p className="text-sm text-gray-500">{new Date(request.dispatchedAt).toLocaleString()}</p>
                )}
              </div>
            )}
            {request.receivedBy && (
              <div>
                <span className="text-gray-600">Received By:</span>
                <p className="font-medium">{request.receivedBy}</p>
                {request.receivedAt && (
                  <p className="text-sm text-gray-500">{new Date(request.receivedAt).toLocaleString()}</p>
                )}
              </div>
            )}
          </div>
          {request.nonCompliance === "YES" && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="font-semibold text-red-800">Non-Compliance Reported</p>
              <p className="text-sm text-red-700 mt-1">{request.nonComplianceDetails}</p>
            </div>
          )}
        </Card>
      )}

      {/* Denomination Details */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Denomination Breakdown</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Denomination</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total Value (TND)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {request.denominationDetails.map((detail) => (
              <TableRow key={detail.id}>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    detail.denominationType === "BILL"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {detail.denominationType}
                  </span>
                </TableCell>
                <TableCell className="font-medium">{Number(detail.denomination).toFixed(3)} TND</TableCell>
                <TableCell>{detail.quantity}</TableCell>
                <TableCell className="font-semibold">{Number(detail.totalValue).toFixed(3)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="text-right font-bold">Total:</TableCell>
              <TableCell className="font-bold text-lg">{Number(request.totalAmount).toFixed(3)} TND</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      {/* Action History */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Action History</h2>
        {request.actionLogs.length === 0 ? (
          <p className="text-gray-500">No actions recorded yet</p>
        ) : (
          <div className="space-y-3">
            {request.actionLogs.map((log) => (
              <div key={log.id} className="border-l-4 border-[rgb(var(--amen-green))] pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{log.action}</p>
                    <p className="text-sm text-gray-600">By: {log.performedBy}</p>
                    {log.details && (
                      <p className="text-sm text-gray-700 mt-1">{log.details}</p>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{new Date(log.performedAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Dialogs */}
      <Dialog open={validateDialogOpen} onOpenChange={setValidateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Validate Request</DialogTitle>
            <DialogDescription>
              Confirm that you want to validate this request. It will be forwarded to Tunisia Security for team assignment.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setValidateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleValidate} disabled={isSubmitting}>
              {isSubmitting ? "Validating..." : "Confirm Validation"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleReject} disabled={isSubmitting || !rejectionReason.trim()}>
                {isSubmitting ? "Rejecting..." : "Reject Request"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Security Team</DialogTitle>
            <DialogDescription>
              Assign a security team to handle this fund transfer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teamName">Team Name *</Label>
              <Input
                id="teamName"
                placeholder="e.g., Team Alpha"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAssign} disabled={isSubmitting || !teamName.trim()}>
                {isSubmitting ? "Assigning..." : "Assign Team"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={receiveDialogOpen} onOpenChange={setReceiveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Receipt</DialogTitle>
            <DialogDescription>
              Confirm that you have received the funds. Please verify your identity with your password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="receivedBy">Received By *</Label>
              <Input
                id="receivedBy"
                placeholder="Enter your full name"
                value={receivedBy}
                onChange={(e) => setReceivedBy(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password to confirm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nonCompliance">Non-Compliance *</Label>
              <Select value={nonCompliance} onValueChange={(value) => setNonCompliance(value as "YES" | "NO")}>
                <SelectTrigger id="nonCompliance">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NO">No - Everything is correct</SelectItem>
                  <SelectItem value="YES">Yes - There is a discrepancy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {nonCompliance === "YES" && (
              <div className="space-y-2">
                <Label htmlFor="nonComplianceDetails">Non-Compliance Details *</Label>
                <Input
                  id="nonComplianceDetails"
                  placeholder="Describe the discrepancy"
                  value={nonComplianceDetails}
                  onChange={(e) => setNonComplianceDetails(e.target.value)}
                />
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setReceiveDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleReceive} disabled={isSubmitting || !receivedBy.trim() || !password.trim()}>
                {isSubmitting ? "Confirming..." : "Confirm Receipt"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}