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

    const roles = await prisma.role.findMany({
      select: {
        id: true,
        name: true,
        description: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({
      status: 'success',
      data: roles
    })
  } catch (error) {
    console.error('Error fetching roles:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch roles',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}