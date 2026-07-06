import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    // Authenticated user (uses request cookies)
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check admin role
    if (user.user_metadata?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Service-role client
    const admin = createAdminClient()

    const { data, error } = await admin.auth.admin.listUsers()

    if (error) {
      console.error('Supabase Admin Error:', error)

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    const users = data.users.map((user) => ({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      status: user.user_metadata?.status ?? 'CONFIRMED',
      is_admin: user.user_metadata?.role === 'admin',
      is_banned: user.user_metadata?.banned === true,
    }))

    return NextResponse.json({ users })
  } catch (error) {
    console.error('GET /api/admin/users:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}