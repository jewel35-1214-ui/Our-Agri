import { requireAdmin } from '@/lib/auth/protect'
import { promoteUserToAdmin } from '@/lib/auth/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Verify the requester is an admin
    await requireAdmin()

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const result = await promoteUserToAdmin(userId)

    return NextResponse.json({
      success: true,
      user: result,
    })
  } catch (error) {
    console.error('[v0] Error promoting user:', error)
    return NextResponse.json(
      { error: 'Failed to promote user to admin' },
      { status: 500 }
    )
  }
}