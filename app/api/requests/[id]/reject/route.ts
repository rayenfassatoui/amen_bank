import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth-utils"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authCheck = await requireRole(["Central Cash"])
    if (authCheck instanceof NextResponse) return authCheck

    const session = authCheck
    const { id } = await params
    const body = await request.json()
    const { reason } = body

    const fundRequest = await prisma.request.findUnique({ where: { id } })

    if (!fundRequest) {
      return NextResponse.json(
        { status: "error", message: "Request not found" },
        { status: 404 }
      )
    }

    if (fundRequest.status !== "SUBMITTED") {
      return NextResponse.json(
        {
          status: "error",
          message: `Cannot reject request with status: ${fundRequest.status}`,
        },
        { status: 400 }
      )
    }

    const updatedRequest = await prisma.$transaction(async (tx) => {
      const updated = await tx.request.update({
        where: { id },
        data: { status: "REJECTED", description: reason || fundRequest.description },
        include: { user: true, agency: true, denominationDetails: true },
      })

      await tx.actionLog.create({
        data: {
          action: "REQUEST_REJECTED",
          performedBy: `${session.user.name} (${session.user.role})`,
          userId: session.user.id,
          requestId: id,
          details: reason || "Request rejected by Central Cash",
        },
      })

      return updated
    })

    return NextResponse.json({
      status: "success",
      message: "Request rejected",
      data: updatedRequest,
    })
  } catch (error) {
    console.error("Error rejecting request:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to reject request",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}