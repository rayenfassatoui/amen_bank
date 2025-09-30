import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth-utils"

export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Only Administrator can view all audit logs
    if (session.user.role !== "Administrator") {
      return NextResponse.json(
        { error: "Forbidden - Administrator access required" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)

    // Pagination
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const skip = (page - 1) * limit

    // Filters
    const userId = searchParams.get("userId")
    const requestId = searchParams.get("requestId")
    const action = searchParams.get("action")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")

    const where: any = {}

    if (userId) {
      where.userId = userId
    }

    if (requestId) {
      where.requestId = requestId
    }

    if (action) {
      where.action = { contains: action, mode: "insensitive" }
    }

    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo)
      }
    }

    const total = await prisma.actionLog.count({ where })

    const logs = await prisma.actionLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        request: {
          select: {
            id: true,
            requestType: true,
            status: true,
            totalAmount: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    })

    return NextResponse.json({
      status: "success",
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + limit < total,
      },
    })
  } catch (error) {
    console.error("Error fetching audit logs:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch audit logs",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}