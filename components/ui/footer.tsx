import Logo from '@/components/ui/logo'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 pt-8 dark:border-slate-800">
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4">
        <div className="mb-4 md:mb-0">
          <div className="shrink-0 flex flex-col md:flex-row items-center">
            {/* Logo */}
            <Logo />
            <div className="text-sm text-slate-500 ml-4">
              All trademarks, logos, service marks and company names appeared here are the property of their respective owners.
            </div>
          </div>
        </div>
        {/* Social links */}
        <ul className="inline-flex space-x-2">
          <li>
            <a
              className="flex justify-center items-center text-[#f26622] hover:text-[#d4551a] transition duration-150 ease-in-out"
              href="https://www.linkedin.com/in/jean-maatouk"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.3 8H8.7c-.4 0-.7.3-.7.7v14.7c0 .3.3.6.7.6h14.7c.4 0 .7-.3.7-.7V8.7c-.1-.4-.4-.7-.8-.7zM12.7 21.6h-2.3V14h2.4v7.6h-.1zM11.6 13c-.8 0-1.4-.7-1.4-1.4 0-.8.6-1.4 1.4-1.4.8 0 1.4.6 1.4 1.4-.1.7-.7 1.4-1.4 1.4zm10 8.6h-2.4v-3.7c0-.9 0-2-1.2-2s-1.4 1-1.4 2v3.8h-2.4V14h2.3v1c.3-.6 1.1-1.2 2.2-1.2 2.4 0 2.8 1.6 2.8 3.6v4.2h.1z" />
              </svg>
            </a>
          </li>
          <li>
            <a
              className="flex justify-center items-center text-[#f26622] hover:text-[#d4551a] transition duration-150 ease-in-out"
              href="mailto:maatouk.j1@gmail.com"
              aria-label="Email"
            >
              <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 14.8l7.7-5.3H8.3L16 14.8zm8-4.5v11.2c0 .3-.2.5-.5.5h-15c-.3 0-.5-.2-.5-.5V10.3l8 5.5 8-5.5z" />
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
