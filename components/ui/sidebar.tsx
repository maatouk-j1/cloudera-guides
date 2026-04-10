'use client'

import { useRef, useEffect } from 'react'
import { useAppProvider } from '@/app/app-provider'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { navigation, type NavItem } from '@/lib/navigation'
import SidebarLink from './sidebar-link'

function isActive(item: NavItem, pathname: string): boolean {
  if (item.href && pathname === item.href) return true;
  if (item.children) {
    return item.children.some((child) => isActive(child, pathname));
  }
  return false;
}

function TopLevelIcon() {
  return (
    <svg className="mr-3 shrink-0" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        className="fill-[#f5854e]"
        d="M19.888 7.804a.88.88 0 0 0-.314-.328l-7.11-4.346a.889.889 0 0 0-.927 0L4.426 7.476a.88.88 0 0 0-.314.328L12 12.624l7.888-4.82Z"
      />
      <path
        className="fill-white dark:fill-slate-800"
        d="M4.112 7.804a.889.889 0 0 0-.112.43v7.892c0 .31.161.597.426.758l7.11 4.346c.14.085.3.13.464.13v-8.736l-7.888-4.82Z"
      />
      <path
        className="fill-[#d4551a]"
        d="M19.888 7.804c.073.132.112.28.112.43v7.892c0 .31-.161.597-.426.758l-7.11 4.346c-.14.085-.3.13-.464.13v-8.736l7.888-4.82Z"
      />
    </svg>
  );
}

function NavLeaf({ item, depth }: { item: NavItem; depth: number }) {
  const isTopLevel = depth === 0;
  return (
    <li className={isTopLevel ? "mb-1 p-1" : "mt-3"}>
      <SidebarLink href={item.href!}>
        {isTopLevel && <TopLevelIcon />}
        <span className={isTopLevel ? "font-[650]" : ""}>{item.title}</span>
      </SidebarLink>
    </li>
  );
}

function NavGroup({ item, depth, pathname }: { item: NavItem; depth: number; pathname: string }) {
  const active = isActive(item, pathname);

  if (item.href && !item.children) {
    return <NavLeaf item={item} depth={depth} />;
  }

  if (!item.children) return null;

  return (
    <NavBranch item={item} depth={depth} pathname={pathname} defaultOpen={active} />
  );
}

function NavBranch({ item, depth, pathname, defaultOpen }: { item: NavItem; depth: number; pathname: string; defaultOpen: boolean }) {
  const isTopLevel = depth === 0;

  return (
    <li className={isTopLevel ? "mb-1" : "mt-3"}>
      <details open={defaultOpen}>
        <summary
          className={`flex items-center cursor-pointer list-none font-medium ${
            isTopLevel
              ? 'font-[650] text-slate-800 p-1 dark:text-slate-200'
              : 'text-slate-800 dark:text-slate-200'
          } ${isActive(item, pathname) && isTopLevel ? 'relative before:absolute before:inset-0 before:rounded-sm before:bg-linear-to-tr before:from-[#f26622] before:to-[#f5854e] before:opacity-20 before:-z-10 before:pointer-events-none' : ''}`}
        >
          {isTopLevel && <TopLevelIcon />}
          {!isTopLevel && (
            <svg className="fill-slate-400 shrink-0 mr-2 transition-transform [details[open]>summary>&]:rotate-90" width="8" height="10" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 2 2.414.586 6.828 5 2.414 9.414 1 8l3-3z" />
            </svg>
          )}
          <span>{item.title}</span>
        </summary>
        <ul className={`${isTopLevel ? 'mb-3 ml-4 pl-6' : 'ml-1 pl-4'} border-l border-slate-200 dark:border-slate-800`}>
          {item.children!.map((child, i) => (
            <NavGroup key={i} item={child} depth={depth + 1} pathname={pathname} />
          ))}
        </ul>
      </details>
    </li>
  );
}

export default function SupportSidebar() {
  const sidebar = useRef<HTMLDivElement>(null)
  const { sidebarOpen, setSidebarOpen } = useAppProvider()
  const pathname = usePathname()

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: { target: EventTarget | null }): void => {
      if (!sidebar.current) return;
      if (!sidebarOpen || sidebar.current.contains(target as Node)) return
      setSidebarOpen(false)
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  })

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: { keyCode: number }): void => {
      if (!sidebarOpen || keyCode !== 27) return
      setSidebarOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  })

  return (
    <div>
      {/* Backdrop */}
      <div
        className={`md:hidden fixed inset-0 bg-slate-900/20 z-10 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <aside
        ref={sidebar}
        id="sidebar"
        className={`fixed left-0 top-0 bottom-0 w-64 h-screen border-r border-slate-200 md:left-auto md:shrink-0 z-10 dark:border-slate-800 dark:bg-slate-900 transform transition-transform ease-out duration-200 ${sidebarOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full max-md:opacity-0"}`}
      >
        {/* Gradient bg displaying on light layout only */}
        <div
          className="absolute inset-0 -left-[9999px] bg-linear-to-b from-slate-50 to-white pointer-events-none -z-10 dark:hidden"
          aria-hidden="true"
        ></div>

        <div className="fixed top-0 bottom-0 w-64 px-4 sm:px-6 md:pl-0 md:pr-8 overflow-y-auto no-scrollbar">
          <div className="pt-24 md:pt-28 pb-8">
            {/* Docs nav */}
            <nav className="md:block">
              <ul className="text-sm">
                {navigation.map((item, i) => (
                  <NavGroup key={i} item={item} depth={0} pathname={pathname} />
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </aside>
    </div>
  )
}
