import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth-utils'
import { updateUserSchema } from '@/lib/validations/user'
import bcrypt from 'bcryptjs'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Require Administrator role
    const authCheck = await requireRole(['Administrator'])
    if (authCheck instanceof NextResponse) {
      return authCheck
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
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
      }
    })

    if (!user) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'User not found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      status: 'success',
      data: user
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch user',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Require Administrator role
    const authCheck = await requireRole(['Administrator'])
    if (authCheck instanceof NextResponse) {
      return authCheck
    }

    const body = await request.json()

    // Validate input
    const validation = updateUserSchema.safeParse(body)
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

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!existingUser) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'User not found'
        },
        { status: 404 }
      )
    }

    const { email, password, firstName, lastName, phone, roleId, agencyId, isActive } = validation.data

    // If email is being updated, check if it's already taken
    if (email && email !== existingUser.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email }
      })

      if (emailTaken) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'Email already in use'
          },
          { status: 409 }
        )
      }
    }

    // Prepare update data
    const updateData: any = {
      email,
      firstName,
      lastName,
      phone,
      roleId,
      agencyId,
      isActive
    }

    // Hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 12)
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    // Update user
    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json({
      status: 'success',
      message: 'User updated successfully',
      data: user
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to update user',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Require Administrator role
    const authCheck = await requireRole(['Administrator'])
    if (authCheck instanceof NextResponse) {
      return authCheck
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!existingUser) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'User not found'
        },
        { status: 404 }
      )
    }

    // Delete user
    await prisma.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      status: 'success',
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to delete user',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}