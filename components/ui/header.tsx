import Logo from '@/components/ui/logo'
import ThemeToggle from './theme-toggle'
import Search from './search'
import { buildSearchIndex } from '@/lib/search-index'

export default function Header() {
  const searchIndex = buildSearchIndex()

  return (
    <header className="fixed w-full z-30">
      <div
        className="absolute inset-0 bg-white/70 border-b border-slate-200 backdrop-blur-sm -z-10 dark:bg-slate-900 dark:border-slate-800"
        aria-hidden="true"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Site branding */}
          <div className="grow">
            <div className="flex items-center">
              <Logo />
              <Search searchIndex={searchIndex} />
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="flex">
            <ul className="flex grow justify-end flex-wrap items-center">
              {/* Lights switch */}
              <li>
                <ThemeToggle />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
