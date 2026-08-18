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
    if (!window.location.hash) {
      window.scrollTo(0, 0)
      return
    }

    // Read the hash on every re-anchor rather than capturing it once: the reader
    // may pick another heading while the page is still settling, and that new
    // target is the one to hold.
    const scrollToHash = () => {
      const hash = window.location.hash
      if (!hash) return
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
    // The font swap can land after we stop, so drop this one too once we have.
    document.fonts.ready.then(() => {
      if (!signal.aborted) scrollToHash()
    })

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
