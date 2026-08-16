'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Footer from '@/components/ui/footer'
import { resolveRedirect } from '@/lib/redirects'

export default function NotFound() {
  const [redirecting, setRedirecting] = useState(false)

  // Static export has no server, so renamed slugs are forwarded from here —
  // GitHub Pages serves this page for every unmatched path. See lib/redirects.ts.
  useEffect(() => {
    const target = resolveRedirect(window.location.pathname)
    if (!target) return

    setRedirecting(true)
    window.location.replace(target + window.location.search + window.location.hash)
  }, [])

  if (redirecting) {
    return (
      <div className="xl:flex">
        <div className="w-full">
          <p className="text-lg text-stone-600 dark:text-stone-400">
            This page has moved. Redirecting&hellip;
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="xl:flex">
      <div className="w-full">
        <article>
          <div className="mb-10">
            <h1 className="text-3xl font-[650] text-stone-800 dark:text-stone-100 mb-3">
              Page not found
            </h1>
            <p className="text-lg text-stone-600 dark:text-stone-400">
              This page has moved or no longer exists. The guides are now grouped by
              installation version, so the page you want is likely under a version heading
              in the sidebar.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            <Link
              href="/"
              className="group block rounded-lg border border-stone-200 dark:border-stone-700 p-5 hover:border-[#f26622] dark:hover:border-[#f26622] transition-colors"
            >
              <h2 className="text-base font-[650] text-stone-800 dark:text-stone-100 group-hover:text-[#f26622] transition-colors mb-2">
                Home
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Start from the top of the Cloudera Platform Guide.
              </p>
            </Link>

            <Link
              href="/installations"
              className="group block rounded-lg border border-stone-200 dark:border-stone-700 p-5 hover:border-[#f26622] dark:hover:border-[#f26622] transition-colors"
            >
              <h2 className="text-base font-[650] text-stone-800 dark:text-stone-100 group-hover:text-[#f26622] transition-colors mb-2">
                Installations
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Browse the installation guides by version.
              </p>
            </Link>
          </div>
        </article>

        <Footer />
      </div>
    </div>
  )
}
