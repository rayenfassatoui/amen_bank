import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth-utils'
import { createUserSchema } from '@/lib/validations/user'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    // Require Administrator role
    const authCheck = await requireRole(['Administrator'])
    if (authCheck instanceof NextResponse) {
      return authCheck
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        roleId: true,
        agencyId: true,
        role: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        agency: {
          select: {
            id: true,
            name: true,
            code: true,
            city: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      status: 'success',
      data: users
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch users',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // Require Administrator role
    const authCheck = await requireRole(['Administrator'])
    if (authCheck instanceof NextResponse) {
      return authCheck
    }

    const body = await request.json()

    // Validate input
    const validation = createUserSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Validation failed',
          errors: validation.error.format()
        },
        { status: 400 }
      )
    }

    const { email, password, firstName, lastName, phone, roleId, agencyId, isActive } = validation.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'User with this email already exists'
        },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        roleId,
        agencyId,
        isActive
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        role: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        agency: {
          select: {
            id: true,
            name: true,
            code: true,
            city: true
          }
        }
      }
    })

    return NextResponse.json(
      {
        status: 'success',
        message: 'User created successfully',
        data: user
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to create user',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}