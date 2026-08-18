'use client'

import { useState, useEffect, type MouseEvent } from 'react'

export default function SecondaryNav() {

  const [targets, setTargets] = useState<HTMLElement[]>([])
  const [links, setLinks] = useState<HTMLElement[]>([])

  const scrollSpy = () => {
    const links = document.querySelectorAll('[data-scrollspy-link]') as NodeListOf<HTMLElement>
    if (links.length < 1) return
    const addActive = (i: number) => {
      const link = links[i] ? links[i] : links[0]
      link.classList.add('scrollspy-active')
    }
    const removeActive = (i: number) => {
      links[i].classList.remove('scrollspy-active')
    }
    const removeAllActive = () => [...Array(targets.length).keys()].forEach((link) => removeActive(link))
    const targetMargin = 100
    let currentActive = 0
    addActive(0)
    // listen for scroll events
    window.addEventListener('scroll', () => {
      const current = targets.length - [...targets].reverse().findIndex((target) => window.scrollY >= target.offsetTop - targetMargin) - 1
      if (current !== currentActive) {
        removeAllActive()
        currentActive = current
        addActive(current)
      }
    })
  }
  
  // select targets
  useEffect(() => {
    const targets = document.querySelectorAll('h2') as NodeListOf<HTMLElement>
    setTargets(Array.from(targets))
  }, [])  

  // populate the right sidebar
  useEffect(() => {
    let linksArray: HTMLElement[]  = []
    targets.map((target) => {
      linksArray.push(target)
    })
    setLinks(linksArray)
  }, [targets])

  // init scrollspy
  useEffect(() => {
    scrollSpy()
  }, [links])

  // Scroll to the heading ourselves rather than leaning on the browser's own
  // jump to the fragment: a target the browser fails to resolve leaves the
  // reader at the top of the page instead of at the section they picked.
  const scrollToHeading = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    // Let the reader open the link their own way (new tab, new window).
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    const target = document.getElementById(id)
    if (!target) return

    event.preventDefault()
    target.scrollIntoView({ behavior: 'smooth' })
    // Keep the current router state so the entry stays a plain hash step.
    window.history.pushState(window.history.state, '', `#${encodeURIComponent(id)}`)
  }

  return (
    <div className={`w-48 shrink-0 ${links.length > 1 ? 'hidden xl:block' : 'hidden'}`}>
      {links.length > 1 &&
        <nav>
          {/* Offsets mirror the left sidebar's so both columns start level. */}
          <div className="fixed top-0 bottom-0 w-48 overflow-y-auto pt-24 md:pt-28 pb-8 no-scrollbar">
            <div className="border-l border-stone-200 dark:border-stone-800">
              <div className="text-xs font-[650] text-stone-400 uppercase pl-4 py-1.5 dark:text-stone-200">On this page</div>
              <ul className="text-sm">
                {links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      data-scrollspy-link
                      className="relative block font-normal text-stone-600 pl-4 py-1.5 before:absolute before:-left-px before:top-2 before:bottom-2 before:w-0.5"
                      href={`#${link.id}`}
                      onClick={(event) => scrollToHeading(event, link.id)}
                    >
                      {link.textContent}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      }
    </div>
  )
}