import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Protect a route by requiring admin role
 * Use in Server Components or API routes
 */
export async function requireAdmin() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const isAdmin = user.user_metadata?.role === 'admin'

  if (!isAdmin) {
    redirect('/dashboard')
  }

  return user
}

/**
 * Protect a route by requiring authentication
 * Use in Server Components or API routes
 */
export async function requireAuth() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return user
}

/**
 * Get the current user safely
 * Returns null if no user is authenticated
 */
export async function getCurrentUser() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user || null
}