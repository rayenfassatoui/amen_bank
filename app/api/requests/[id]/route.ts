import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth-utils"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const fundRequest = await prisma.request.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        agency: {
          select: {
            id: true,
            name: true,
            code: true,
            city: true,
            address: true,
            phone: true,
          },
        },
        denominationDetails: {
          orderBy: {
            denomination: "desc",
          },
        },
        actionLogs: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!fundRequest) {
      return NextResponse.json(
        { status: "error", message: "Request not found" },
        { status: 404 }
      )
    }

    // Check access permissions
    if (
      session.user.role === "Agency" &&
      fundRequest.agencyId !== session.user.agencyId
    ) {
      return NextResponse.json(
        { status: "error", message: "Forbidden" },
        { status: 403 }
      )
    }

    return NextResponse.json({
      status: "success",
      data: fundRequest,
    })
  } catch (error) {
    console.error("Error fetching request:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch request",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}