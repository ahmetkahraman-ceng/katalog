import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { AdminShell } from '@/components/layout/admin-shell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuth = await isAuthenticated()

  if (!isAuth) {
    redirect('/admin/login')
  }

  return <AdminShell>{children}</AdminShell>
}
