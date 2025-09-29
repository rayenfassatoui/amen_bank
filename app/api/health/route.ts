import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test database connection by counting users
    const userCount = await prisma.user.count()
    const agencyCount = await prisma.agency.count()
    const roleCount = await prisma.role.count()

    return NextResponse.json({
      status: 'success',
      message: 'Database connected successfully',
      data: {
        users: userCount,
        agencies: agencyCount,
        roles: roleCount
      }
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}