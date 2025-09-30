import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { getSession, requireRole } from "@/lib/auth-utils"
import { createRequestSchema } from "@/lib/validations/request"

export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)

    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Filter parameters
    const status = searchParams.get("status")
    const type = searchParams.get("type")
    const agencyId = searchParams.get("agencyId")
    const search = searchParams.get("search")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")
    const minAmount = searchParams.get("minAmount")
    const maxAmount = searchParams.get("maxAmount")

    // Sorting parameters
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    // Build filter based on role
    const where: any = {}

    // Agency users can only see their own requests
    if (session.user.role === "Agency") {
      where.agencyId = session.user.agencyId
    }

    // Central Cash sees submitted requests
    if (session.user.role === "Central Cash" && !status) {
      where.status = { in: ["SUBMITTED", "VALIDATED", "REJECTED"] }
    }

    // Tunisia Security sees validated and assigned requests
    if (session.user.role === "Tunisia Security" && !status) {
      where.status = { in: ["VALIDATED", "ASSIGNED", "DISPATCHED"] }
    }

    // Apply filters
    if (status) {
      where.status = status
    }

    if (type) {
      where.requestType = type
    }

    if (agencyId && session.user.role !== "Agency") {
      where.agencyId = agencyId
    }

    // Search filter (searches in agency name, code, user names)
    if (search) {
      where.OR = [
        { agency: { name: { contains: search, mode: "insensitive" } } },
        { agency: { code: { contains: search, mode: "insensitive" } } },
        { user: { firstName: { contains: search, mode: "insensitive" } } },
        { user: { lastName: { contains: search, mode: "insensitive" } } },
      ]
    }

    // Date range filter
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo)
      }
    }

    // Amount range filter
    if (minAmount || maxAmount) {
      where.totalAmount = {}
      if (minAmount) {
        where.totalAmount.gte = parseFloat(minAmount)
      }
      if (maxAmount) {
        where.totalAmount.lte = parseFloat(maxAmount)
      }
    }

    // Build orderBy object
    const orderBy: any = {}
    if (sortBy === "totalAmount") {
      orderBy.totalAmount = sortOrder
    } else if (sortBy === "status") {
      orderBy.status = sortOrder
    } else if (sortBy === "agency") {
      orderBy.agency = { name: sortOrder }
    } else {
      orderBy.createdAt = sortOrder
    }

    // Get total count for pagination
    const total = await prisma.request.count({ where })

    // Fetch requests with pagination
    const requests = await prisma.request.findMany({
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
        agency: {
          select: {
            id: true,
            name: true,
            code: true,
            city: true,
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
          take: 10,
        },
      },
      orderBy,
      skip,
      take: limit,
    })

    return NextResponse.json({
      status: "success",
      data: requests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + limit < total,
      },
    }, {
      headers: {
        "Cache-Control": "private, max-age=60", // Cache for 60 seconds
      },
    })
  } catch (error) {
    console.error("Error fetching requests:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch requests",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // Only Agency role can create requests
    const authCheck = await requireRole(["Agency"])
    if (authCheck instanceof NextResponse) {
      return authCheck
    }

    const session = authCheck
    const body = await request.json()

    // Validate input
    const validation = createRequestSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          status: "error",
          message: "Validation failed",
          errors: validation.error.format(),
        },
        { status: 400 }
      )
    }

    const { requestType, totalAmount, currency, description, denominationDetails } =
      validation.data

    // Use Prisma transaction to create request and denomination details atomically
    const result = await prisma.$transaction(async (tx) => {
      // Create the request
      const newRequest = await tx.request.create({
        data: {
          requestType,
          totalAmount,
          currency,
          description,
          userId: session.user.id,
          agencyId: session.user.agencyId,
          status: "SUBMITTED",
        },
      })

      // Create denomination details
      const denominationRecords = await tx.denominationDetail.createMany({
        data: denominationDetails.map((detail) => ({
          requestId: newRequest.id,
          denomination: detail.denomination,
          denominationType: detail.denominationType,
          quantity: detail.quantity,
          totalValue: detail.totalValue,
        })),
      })

      // Create action log
      await tx.actionLog.create({
        data: {
          action: "REQUEST_CREATED",
          performedBy: `${session.user.name} (${session.user.role})`,
          userId: session.user.id,
          requestId: newRequest.id,
          details: `Created ${requestType} request for ${totalAmount} ${currency}`,
        },
      })

      return { request: newRequest, denominationCount: denominationRecords.count }
    })

    // Fetch the complete request with relations
    const completeRequest = await prisma.request.findUnique({
      where: { id: result.request.id },
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
          },
        },
        denominationDetails: true,
        actionLogs: true,
      },
    })

    return NextResponse.json(
      {
        status: "success",
        message: "Request created successfully",
        data: completeRequest,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating request:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to create request",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}