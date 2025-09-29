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

    const fundRequest = await prisma.request.findUnique({
      where: { id },
    })

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
          message: `Cannot validate request with status: ${fundRequest.status}`,
        },
        { status: 400 }
      )
    }

    const updatedRequest = await prisma.$transaction(async (tx) => {
      const updated = await tx.request.update({
        where: { id },
        data: { status: "VALIDATED" },
        include: {
          user: true,
          agency: true,
          denominationDetails: true,
        },
      })

      await tx.actionLog.create({
        data: {
          action: "REQUEST_VALIDATED",
          performedBy: `${session.user.name} (${session.user.role})`,
          userId: session.user.id,
          requestId: id,
          details: "Request validated by Central Cash",
        },
      })

      return updated
    })

    return NextResponse.json({
      status: "success",
      message: "Request validated successfully",
      data: updatedRequest,
    })
  } catch (error) {
    console.error("Error validating request:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to validate request",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}