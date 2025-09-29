import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth-utils"
import { assignTeamSchema } from "@/lib/validations/request"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authCheck = await requireRole(["Tunisia Security"])
    if (authCheck instanceof NextResponse) return authCheck

    const session = authCheck
    const { id } = await params
    const body = await request.json()

    const validation = assignTeamSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { status: "error", message: "Validation failed", errors: validation.error.format() },
        { status: 400 }
      )
    }

    const fundRequest = await prisma.request.findUnique({ where: { id } })

    if (!fundRequest) {
      return NextResponse.json(
        { status: "error", message: "Request not found" },
        { status: 404 }
      )
    }

    if (fundRequest.status !== "VALIDATED") {
      return NextResponse.json(
        {
          status: "error",
          message: `Cannot assign team to request with status: ${fundRequest.status}`,
        },
        { status: 400 }
      )
    }

    const updatedRequest = await prisma.$transaction(async (tx) => {
      const updated = await tx.request.update({
        where: { id },
        data: {
          status: "ASSIGNED",
          teamAssigned: validation.data.teamAssigned
        },
        include: { user: true, agency: true, denominationDetails: true },
      })

      await tx.actionLog.create({
        data: {
          action: "TEAM_ASSIGNED",
          performedBy: `${session.user.name} (${session.user.role})`,
          userId: session.user.id,
          requestId: id,
          details: `Team ${validation.data.teamAssigned} assigned`,
        },
      })

      return updated
    })

    return NextResponse.json({
      status: "success",
      message: "Team assigned successfully",
      data: updatedRequest,
    })
  } catch (error) {
    console.error("Error assigning team:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to assign team",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}