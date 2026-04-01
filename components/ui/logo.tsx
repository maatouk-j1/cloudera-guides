import Link from 'next/link'

export default function Logo() {
  return (
    <Link className="inline-flex items-center mb-2 md:mb-0" href="/" aria-label="Cloudera CDP Guide">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="#f26622" />
        <text x="16" y="22" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="sans-serif">C</text>
      </svg>
      <span className="ml-2 text-lg font-[650] text-slate-800 dark:text-slate-200">CDP Guide</span>
    </Link>
  )
}
