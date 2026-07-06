import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    // Validate environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
      console.error('[v0] Missing Supabase environment variables')
      return NextResponse.json(
        { error: 'Supabase configuration is missing' },
        { status: 500 }
      )
    }

    // Create admin client for server-side operations
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Get session from cookies
    const cookieStore = await cookies()
    const supabaseAuth = createClient(supabaseUrl, publishableKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    })

    // Check if user is authenticated and is admin
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const isAdmin = user.user_metadata?.role === 'admin'
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get all users from Supabase Auth
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) {
      console.error('[v0] Supabase error:', error)
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
