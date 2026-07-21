import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppProvider } from '@/app/app-provider'

interface SidebarLinkProps {
  children: React.ReactNode
  href: string
}

export default function SidebarLink({
  children,
  href,
}: SidebarLinkProps) {

  const pathname = usePathname()
  const { setSidebarOpen } = useAppProvider()  
  
  // prefetch={false}: the sidebar renders the whole doc tree, and Next's default
  // viewport prefetching pulls in every sibling route's RSC payload. React then
  // preloads each of those pages' <img> sources against the *current* document,
  // downloading tens of MB of screenshots this page never renders. See issue #35.
  return (
    <Link prefetch={false} className={`flex items-center space-x-3 font-medium ${pathname === href ? 'text-[#f26622]' : 'text-slate-800 dark:text-slate-200'}`} href={href} onClick={() => setSidebarOpen(false)}>
      {children}
    </Link>
  )
}
