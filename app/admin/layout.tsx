import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const metadata = {
  title: 'Admin Dashboard - OurAgri',
  description: 'Admin management panel',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // Handle cookie errors silently
          }
        },
      },
    },
  )

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check if user is admin
  const isAdmin = user.user_metadata?.role === 'admin'

  if (!isAdmin) {
    redirect('/dashboard')
  }

  // Auto-redirect to /admin/users if accessing /admin directly
  if (typeof window === 'undefined') {
    // Server-side only
    const pathname = ''
    if (pathname === '/admin' || pathname === '/admin/') {
      redirect('/admin/users')
    }
  }

  return <>{children}</>
}
