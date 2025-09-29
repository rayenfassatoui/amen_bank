import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()

  if (!session?.user?.email) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      role: true,
      agency: true,
    },
  })

  return user
}

export async function requireAuth() {
  const session = await getSession()

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  return session
}

export async function requireRole(allowedRoles: string[]) {
  const session = await getSession()

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  if (!allowedRoles.includes(session.user.role)) {
    return NextResponse.json(
      { error: "Forbidden - Insufficient permissions" },
      { status: 403 }
    )
  }

  return session
}

export function createUnauthorizedResponse() {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  )
}

export function createForbiddenResponse() {
  return NextResponse.json(
    { error: "Forbidden - Insufficient permissions" },
    { status: 403 }
  )
}