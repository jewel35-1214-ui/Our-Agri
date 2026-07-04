import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Promote a user to admin role
 */
export async function promoteUserToAdmin(userId: string) {
  const admin = createAdminClient()

  // Update user metadata to include admin role
  const { data, error } = await admin.auth.admin.updateUserById(userId, {
    user_metadata: {
      role: 'admin',
    },
  })

  if (error) {
    throw new Error(`Failed to promote user to admin: ${error.message}`)
  }

  return data
}

/**
 * Demote an admin user to regular user
 */
export async function demoteAdminUser(userId: string) {
  const admin = createAdminClient()

  const { data, error } = await admin.auth.admin.updateUserById(userId, {
    user_metadata: {
      role: 'user',
    },
  })

  if (error) {
    throw new Error(`Failed to demote admin user: ${error.message}`)
  }

  return data
}

/**
 * Check if a user is an admin
 */
export function isAdmin(userMetadata?: Record<string, any>): boolean {
  return userMetadata?.role === 'admin'
}

/**
 * Get all admin users
 */
export async function getAllAdminUsers() {
  const admin = createAdminClient()

  const { data, error } = await admin.auth.admin.listUsers()

  if (error) {
    throw new Error(`Failed to list users: ${error.message}`)
  }

  return data.users.filter((user) => user.user_metadata?.role === 'admin')
}
