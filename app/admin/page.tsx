import { requireAdmin } from '@/lib/auth/protect'
import { getAllAdminUsers, demoteAdminUser } from '@/lib/auth/admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Leaf } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Admin Dashboard - OurAgri',
  description: 'Manage system administrators and users',
}

async function AdminActions() {
  const admins = await getAllAdminUsers()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
          <CardDescription>
            Manage admin accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {admins.length === 0 ? (
            <p className="text-sm text-muted-foreground">No admin users found</p>
          ) : (
            <div className="space-y-4">
              {admins.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{admin.email}</p>
                    <p className="text-sm text-muted-foreground">
                      ID: {admin.id}
                    </p>
                  </div>
                  <form
                    action={async () => {
                      'use server'
                      await demoteAdminUser(admin.id)
                    }}
                  >
                    <Button variant="outline" type="submit">
                      Demote
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default async function AdminPage() {
      redirect('/admin/users');

  await requireAdmin()

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">OurAgri Admin</span>
          </Link>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Administration</h1>
            <p className="mt-2 text-muted-foreground">
              Manage system administrators and user roles
            </p>
          </div>

          <AdminActions />
        </div>
      </main>
    </div>
  )
}