import Link from 'next/link'
import Footer from '@/components/ui/footer'

export default function Home() {
  return (
    <div className="xl:flex">
      <div className="w-full">
        <article>
          <div className="mb-10">
            <h1 className="text-3xl font-[650] text-slate-800 dark:text-slate-100 mb-3">
              Cloudera CDP Guide
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              A practical guide to deploying, operating, and scaling Cloudera Data Platform (CDP).
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            <Link
              href="/cdppvc/cdppvc"
              className="group block rounded-lg border border-slate-200 dark:border-slate-700 p-5 hover:border-[#f26622] dark:hover:border-[#f26622] transition-colors"
            >
              <h2 className="text-base font-[650] text-slate-800 dark:text-slate-100 group-hover:text-[#f26622] transition-colors mb-2">
                CDP Private Cloud
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Installations, upgrades, data services, and day-2 operations for CDP Private Cloud.
              </p>
            </Link>

            <Link
              href="/cdp-public-cloud"
              className="group block rounded-lg border border-slate-200 dark:border-slate-700 p-5 hover:border-[#f26622] dark:hover:border-[#f26622] transition-colors"
            >
              <h2 className="text-base font-[650] text-slate-800 dark:text-slate-100 group-hover:text-[#f26622] transition-colors mb-2">
                CDP Public Cloud
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Cloudera Data Platform on public cloud infrastructure.
              </p>
            </Link>
          </div>
        </article>

        <Footer />
      </div>
    </div>
  )
}
