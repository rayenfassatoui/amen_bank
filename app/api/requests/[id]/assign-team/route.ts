import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is Tunisia Security
    if (session.user.role !== 'Tunisia Security') {
      return NextResponse.json(
        { error: 'Access denied. Tunisia Security role required.' },
        { status: 403 }
      )
    }

    const { id: requestId } = await params
    const body = await request.json()
    const { teamName, cinChauffeur, cinTransporteur } = body

    // Validate required fields
    if (!teamName || !cinChauffeur || !cinTransporteur) {
      return NextResponse.json(
        { error: 'Team name, CIN Chauffeur, and CIN Transporteur are required' },
        { status: 400 }
      )
    }

    // Check if request exists and is validated
    const existingRequest = await prisma.request.findUnique({
      where: { id: requestId }
    })

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      )
    }

    if (existingRequest.status !== 'VALIDATED') {
      return NextResponse.json(
        { error: 'Only validated requests can be assigned a security team' },
        { status: 400 }
      )
    }

    // Create security team and assign to request
    const securityTeam = await prisma.securityTeam.create({
      data: {
        teamName,
        cinChauffeur,
        cinTransporteur,
        assignedBy: session.user.email || session.user.name
      }
    })

    // Update request with security team and change status
    const updatedRequest = await prisma.request.update({
      where: { id: requestId },
      data: {
        securityTeamId: securityTeam.id,
        status: 'ASSIGNED'
      },
      include: {
        securityTeam: true,
        agency: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    // Create action log
    await prisma.actionLog.create({
      data: {
        action: 'TEAM_ASSIGNED',
        performedBy: session.user.email || session.user.name || 'Unknown',
        userId: session.user.id,
        requestId: requestId,
        details: `Assigned team: ${teamName} (Chauffeur: ${cinChauffeur}, Transporteur: ${cinTransporteur})`
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Security team assigned successfully',
      data: updatedRequest
    })
  } catch (error) {
    console.error('Error assigning security team:', error)
    return NextResponse.json(
      { error: 'Failed to assign security team' },
      { status: 500 }
    )
  }
}