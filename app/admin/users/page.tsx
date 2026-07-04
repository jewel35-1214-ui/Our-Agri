'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Trash2, Ban, Shield, Check, X } from 'lucide-react'

interface User {
  id: string
  email: string
  created_at: string
  status: 'CONFIRMED' | 'INVITED' | 'UNCONFIRMED'
  is_admin: boolean
  is_banned: boolean
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [action, setAction] = useState<'ban' | 'delete' | 'promote' | 'demote' | null>(null)
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('[v0] Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async () => {
    if (!selectedUser || !action) return

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}/${action}`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error(`Failed to ${action} user`)

      setShowDialog(false)
      setSelectedUser(null)
      setAction(null)
      await fetchUsers()
    } catch (error) {
      console.error(`[v0] Error performing action ${action}:`, error)
    }
  }

  const openDialog = (user: User, actionType: 'ban' | 'delete' | 'promote' | 'demote') => {
    setSelectedUser(user)
    setAction(actionType)
    setShowDialog(true)
  }

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const activeUsers = filteredUsers.filter((u) => u.status === 'CONFIRMED' && !u.is_banned)
  const bannedUsers = filteredUsers.filter((u) => u.is_banned)
  const admins = filteredUsers.filter((u) => u.is_admin)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-svh">
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage all users, ban, delete, and assign admin roles</p>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search users by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">
              Active Users <Badge variant="secondary" className="ml-2">{activeUsers.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="banned">
              Banned Users <Badge variant="destructive" className="ml-2">{bannedUsers.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="admins">
              Admins <Badge variant="outline" className="ml-2">{admins.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeUsers.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No active users found
                </CardContent>
              </Card>
            ) : (
              activeUsers.map((user) => (
                <Card key={user.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold">{user.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </p>
                        {user.is_admin && (
                          <Badge className="mt-2 gap-1">
                            <Shield size={14} />
                            Admin
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!user.is_admin && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDialog(user, 'promote')}
                            className="gap-2"
                          >
                            <Shield size={16} />
                            Make Admin
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDialog(user, 'ban')}
                          className="gap-2"
                        >
                          <Ban size={16} />
                          Ban
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openDialog(user, 'delete')}
                          className="gap-2"
                        >
                          <Trash2 size={16} />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="banned" className="space-y-4">
            {bannedUsers.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No banned users
                </CardContent>
              </Card>
            ) : (
              bannedUsers.map((user) => (
                <Card key={user.id} className="border-destructive/20 bg-destructive/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold">{user.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </p>
                        <Badge variant="destructive" className="mt-2">
                          Banned
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDialog(user, 'ban')}
                          className="gap-2"
                        >
                          <Check size={16} />
                          Unban
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openDialog(user, 'delete')}
                          className="gap-2"
                        >
                          <Trash2 size={16} />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="admins" className="space-y-4">
            {admins.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No admins found
                </CardContent>
              </Card>
            ) : (
              admins.map((user) => (
                <Card key={user.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold">{user.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </p>
                        <Badge className="mt-2 gap-1">
                          <Shield size={14} />
                          Admin
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDialog(user, 'demote')}
                          className="gap-2"
                        >
                          <X size={16} />
                          Remove Admin
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openDialog(user, 'delete')}
                          className="gap-2"
                        >
                          <Trash2 size={16} />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {action === 'ban'
                ? selectedUser?.is_banned
                  ? 'Unban User'
                  : 'Ban User'
                : action === 'delete'
                  ? 'Delete User'
                  : action === 'promote'
                    ? 'Make Admin'
                    : 'Remove Admin'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {action === 'ban'
                ? selectedUser?.is_banned
                  ? `Are you sure you want to unban ${selectedUser?.email}?`
                  : `Are you sure you want to ban ${selectedUser?.email}? They won't be able to access the platform.`
                : action === 'delete'
                  ? `Are you sure you want to permanently delete ${selectedUser?.email}? This action cannot be undone.`
                  : action === 'promote'
                    ? `Make ${selectedUser?.email} an admin? They will have access to all admin features.`
                    : `Remove admin privileges from ${selectedUser?.email}?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className={action === 'delete' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {action === 'ban'
                ? selectedUser?.is_banned
                  ? 'Unban'
                  : 'Ban'
                : action === 'delete'
                  ? 'Delete'
                  : action === 'promote'
                    ? 'Make Admin'
                    : 'Remove Admin'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
