import { redirect } from 'next/navigation'

export default function AdminPage() {
  // Auto-redirect to users management page
  redirect('/admin/users')
}
