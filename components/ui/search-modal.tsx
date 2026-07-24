'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

export type SearchItem = {
  title: string;
  slug: string;
  section: string;
};

interface SearchModalProps {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  searchIndex: SearchItem[]
}

const MAX_RESULTS = 10;

/**
 * A term found in the title outweighs the same term found in the breadcrumb.
 *
 * Matching was unranked while every page's section was the constant string
 * "CDP Private Cloud", which contributed nothing. Now that the section carries
 * the real nav trail, a common word like "install" appears in all 93 breadcrumbs
 * via the "Installations" node â€” so without ranking the top 10 was decided by
 * index order alone, which is alphabetical by path and never reached CDP 7.3.2.
 */
const SCORE_TITLE_PREFIX = 6;
const SCORE_TITLE = 4;
const SCORE_SECTION = 1;

/** Score for one item, or -1 if any term is absent from both title and trail. */
function scoreItem(item: SearchItem, terms: string[]): number {
  const title = item.title.toLowerCase();
  const section = item.section.toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (title.startsWith(term)) score += SCORE_TITLE_PREFIX;
    else if (title.includes(term)) score += SCORE_TITLE;
    else if (section.includes(term)) score += SCORE_SECTION;
    else return -1;
  }
  return score;
}

export default function SearchModal({
  isOpen,
  setIsOpen,
  searchIndex,
}: SearchModalProps) {
  const [query, setQuery] = useState('')

  const { results, totalMatches } = useMemo(() => {
    if (!query.trim()) return { results: [], totalMatches: 0 };
    const terms = query.toLowerCase().split(/\s+/);
    const scored = searchIndex
      .map((item) => ({ item, score: scoreItem(item, terms) }))
      .filter((entry) => entry.score >= 0);
    // Sort is stable, so equally-scored pages keep their nav/index order.
    scored.sort((a, b) => b.score - a.score);
    return {
      results: scored.slice(0, MAX_RESULTS).map((entry) => entry.item),
      totalMatches: scored.length,
    };
  }, [query, searchIndex]);

  return (
    <Dialog as="div" open={isOpen} onClose={() => { setIsOpen(false); setQuery(''); }}>
      <DialogBackdrop
        transition
        className="fixed inset-0 z-99999 bg-stone-900/30 transition-opacity duration-200 ease-out data-closed:opacity-0"
      />
      <div className="fixed inset-0 top-20 z-99999 mb-4 flex items-start justify-center overflow-hidden px-4 sm:px-6 md:top-28">
        <DialogPanel transition className="max-h-full w-full max-w-2xl overflow-auto rounded-xl bg-white shadow-lg duration-300 ease-out data-closed:translate-y-4 data-closed:opacity-0 dark:bg-stone-900">
          {/* Search form */}
          <div className="border-b border-stone-200 dark:border-stone-700">
            <div className="flex items-center">
              <label htmlFor="search-modal">
                <span className="sr-only">Search</span>
                <svg
                  className="w-4 h-4 fill-stone-500 shrink-0 ml-4 dark:fill-stone-400"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m14.707 13.293-1.414 1.414-2.4-2.4 1.414-1.414 2.4 2.4ZM6.8 12.6A5.8 5.8 0 1 1 6.8 1a5.8 5.8 0 0 1 0 11.6Zm0-2a3.8 3.8 0 1 0 0-7.6 3.8 3.8 0 0 0 0 7.6Z" />
                </svg>
              </label>
              <input
                id="search-modal"
                data-autofocus
                className="text-sm w-full bg-white border-0 focus:ring-transparent placeholder-stone-400 appearance-none py-3 pl-2 pr-4 dark:bg-stone-900 dark:placeholder:text-stone-500 dark:text-stone-200"
                type="search"
                placeholder="Search documentation..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="py-4 px-2 space-y-4">
            {query.trim() === '' ? (
              <div className="text-sm text-stone-500 px-2 dark:text-stone-400">Type to search across all documentation pages...</div>
            ) : results.length === 0 ? (
              <div className="text-sm text-stone-500 px-2 dark:text-stone-400">No results found for &quot;{query}&quot;</div>
            ) : (
              <div>
                <div className="text-sm font-medium text-stone-500 px-2 mb-2 dark:text-stone-400">
                  Results
                  {totalMatches > results.length && (
                    <span className="font-normal text-stone-400 dark:text-stone-500">
                      {' '}â€” top {results.length} of {totalMatches}, keep typing to narrow
                    </span>
                  )}
                </div>
                <ul>
                  {results.map((item) => (
                    <li key={item.slug}>
                      {/* prefetch={false} for the same reason as the sidebar (issue #35):
                          every result prefetches its route's RSC payload, and React then
                          preloads that page's screenshots against the current document.
                          The result set changes on each keystroke, so this fans out fast. */}
                      <Link
                        prefetch={false}
                        className="flex items-start px-2 py-1.5 leading-6 text-sm text-stone-800 hover:bg-stone-100 rounded-sm dark:text-stone-200 dark:hover:bg-stone-700 outline-hidden"
                        href={`/${item.slug}`}
                        onClick={() => { setIsOpen(false); setQuery(''); }}
                      >
                        <svg
                          className="w-3 h-3 fill-[#f26622] shrink-0 mr-3 mt-1.5"
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M11.953 4.29a.5.5 0 0 0-.454-.292H6.14L6.984.62A.5.5 0 0 0 6.12.173l-6 7a.5.5 0 0 0 .379.825h5.359l-.844 3.38a.5.5 0 0 0 .864.445l6-7a.5.5 0 0 0 .075-.534Z" />
                        </svg>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{item.title}</div>
                          {/* The full nav trail, on its own line: page titles repeat
                              across guide versions, so the breadcrumb is what tells
                              two same-named results apart (issue #55). */}
                          {item.section && (
                            <div className="text-xs leading-5 text-stone-400 truncate dark:text-stone-500">
                              {item.section}
                            </div>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
