import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-utils'

export async function GET() {
  try {
    // Require authentication
    const authCheck = await requireAuth()
    if (authCheck instanceof NextResponse) {
      return authCheck
    }

    const agencies = await prisma.agency.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        address: true,
        city: true,
        phone: true,
        email: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({
      status: 'success',
      data: agencies
    })
  } catch (error) {
    console.error('Error fetching agencies:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch agencies',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}