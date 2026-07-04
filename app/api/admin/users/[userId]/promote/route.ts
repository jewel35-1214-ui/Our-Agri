import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params

    // Get current user metadata
    const { data: user, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(userId)

    if (getUserError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user metadata to add admin role
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        ...user.user_metadata,
        role: 'admin',
      },
    })

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    return NextResponse.json({
      message: 'User promoted to admin successfully',
    })
  } catch (error) {
    console.error('[v0] Error promoting user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
