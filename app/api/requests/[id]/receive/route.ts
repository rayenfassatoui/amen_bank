import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth-utils"
import { confirmReceiptSchema } from "@/lib/validations/request"
import bcrypt from "bcryptjs"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authCheck = await requireRole(["Agency"])
    if (authCheck instanceof NextResponse) return authCheck

    const session = authCheck
    const { id } = await params
    const body = await request.json()

    const validation = confirmReceiptSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { status: "error", message: "Validation failed", errors: validation.error.format() },
        { status: 400 }
      )
    }

    // Verify password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "User not found" },
        { status: 404 }
      )
    }

    const isPasswordValid = await bcrypt.compare(
      validation.data.password,
      user.password
    )

    if (!isPasswordValid) {
      return NextResponse.json(
        { status: "error", message: "Invalid password" },
        { status: 401 }
      )
    }

    const fundRequest = await prisma.request.findUnique({ where: { id } })

    if (!fundRequest) {
      return NextResponse.json(
        { status: "error", message: "Request not found" },
        { status: 404 }
      )
    }

    // Check if request belongs to user's agency
    if (fundRequest.agencyId !== session.user.agencyId) {
      return NextResponse.json(
        { status: "error", message: "Forbidden" },
        { status: 403 }
      )
    }

    if (fundRequest.status !== "DISPATCHED") {
      return NextResponse.json(
        {
          status: "error",
          message: `Cannot confirm receipt for request with status: ${fundRequest.status}`,
        },
        { status: 400 }
      )
    }

    const updatedRequest = await prisma.$transaction(async (tx) => {
      const updated = await tx.request.update({
        where: { id },
        data: {
          status: validation.data.nonCompliance === "YES" ? "RECEIVED" : "COMPLETED",
          receivedBy: validation.data.receivedBy,
          receivedAt: new Date(),
          nonCompliance: validation.data.nonCompliance,
          nonComplianceDetails: validation.data.nonComplianceDetails,
        },
        include: { user: true, agency: true, denominationDetails: true },
      })

      await tx.actionLog.create({
        data: {
          action: "REQUEST_RECEIVED",
          performedBy: `${session.user.name} (${session.user.role})`,
          userId: session.user.id,
          requestId: id,
          details: validation.data.nonCompliance === "YES"
            ? `Received with non-compliance: ${validation.data.nonComplianceDetails}`
            : `Received by ${validation.data.receivedBy}`,
        },
      })

      return updated
    })

    return NextResponse.json({
      status: "success",
      message: "Receipt confirmed successfully",
      data: updatedRequest,
    })
  } catch (error) {
    console.error("Error confirming receipt:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to confirm receipt",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}