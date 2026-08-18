'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

// How long after load we keep re-anchoring on a hash while late assets settle.
const settleMs = 2000

export default function ScrollToTop() {
  const pathname = usePathname()
  const previousPathname = useRef<string | null>(null)

  useEffect(() => {
    const samePage = previousPathname.current === pathname
    previousPathname.current = pathname
    if (samePage) return

    // A hash is a scroll target, so leave it alone — scrolling to the top here
    // is what undid the browser's own jump to the heading on a reload.
    const hash = window.location.hash
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }

    const scrollToHash = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      target?.scrollIntoView({ behavior: 'instant' })
    }

    scrollToHash()

    // Content images carry no intrinsic size and the body font swaps in late, so
    // everything below them shifts for a moment after the first paint. Re-anchor
    // on each of those reflows, until the page settles or the reader scrolls.
    const controller = new AbortController()
    const { signal } = controller
    const observer = new ResizeObserver(scrollToHash)
    const stop = () => {
      observer.disconnect()
      controller.abort()
    }

    observer.observe(document.documentElement)
    document.fonts.ready.then(scrollToHash)

    for (const event of ['wheel', 'touchstart', 'keydown', 'pointerdown']) {
      window.addEventListener(event, stop, { signal, passive: true })
    }

    const timer = window.setTimeout(stop, settleMs)

    return () => {
      window.clearTimeout(timer)
      stop()
    }
  }, [pathname])

  return null
}
