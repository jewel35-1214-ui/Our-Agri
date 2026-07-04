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

export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all users from Supabase Auth
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Map users to include admin and ban status from metadata
    const mappedUsers = (users?.users || []).map((user) => ({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      status: user.user_metadata?.status || 'CONFIRMED',
      is_admin: user.user_metadata?.role === 'admin',
      is_banned: user.user_metadata?.banned === true,
    }))

    return NextResponse.json({ users: mappedUsers })
  } catch (error) {
    console.error('[v0] Error fetching users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
