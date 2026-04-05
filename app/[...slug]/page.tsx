import type { Metadata } from 'next'
import { getDocPages } from '@/components/mdx/utils'
import { notFound } from 'next/navigation'
import { CustomMDX } from '@/components/mdx/mdx'
import Hamburger from '@/components/ui/hamburger'
import PageNavigation from '@/components/ui/page-navigation'
import Footer from '@/components/ui/footer'
import SecondaryNav from '@/components/ui/secondary-nav'

export async function generateStaticParams() {
  const allPages = getDocPages();

  return allPages.map((page) => ({
    slug: page.slug.split('/'),
  }))
}

export async function generateMetadata(
  props: {
    params: Promise<{ slug: string[] }>
  }
): Promise<Metadata | undefined> {
  const params = await props.params;
  const slugPath = params.slug.join('/');
  const page = getDocPages().find((p) => p.slug === slugPath);

  if (!page) {
    return;
  }

  const { title } = page.metadata;

  return {
    title: title ? `${title} - Cloudera CDP Guide` : 'Cloudera CDP Guide',
  };
}

export default async function DocPage(
  props: {
    params: Promise<{
      slug: string[]
    }>
  }
) {
  const params = await props.params;
  const slugPath = params.slug.join('/');
  const page = getDocPages().find((p) => p.slug === slugPath);

  if (!page) notFound()

  return (
    <>
      <article className="flex xl:space-x-12">

        {/* Main area */}
        <div className="min-w-0">

          {/* Mobile hamburger + breadcrumbs */}
          <div className="md:hidden flex items-center mb-8">

            <Hamburger />

            {/* Breadcrumbs */}
            <div className="flex items-center text-sm whitespace-nowrap min-w-0 ml-3">
              {page.metadata.topicTitle && (
                <span className="text-slate-600 dark:text-slate-400">{page.metadata.topicTitle}</span>
              )}
              <svg className="fill-slate-400 shrink-0 mx-2 dark:fill-slate-500" width="8" height="10" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 2 2.414.586 6.828 5 2.414 9.414 1 8l3-3z" />
              </svg>
              <span className="text-slate-800 font-medium truncate dark:text-slate-200">{page.metadata.title}</span>
            </div>

          </div>

          {/* Article content */}
          <div>
            <header className="mb-6">
              <h1 className="h2 text-slate-800 mb-4 dark:text-slate-200">{page.metadata.title}</h1>
            </header>
            <article className="prose text-slate-600 dark:text-slate-400 max-w-none prose-p:leading-normal prose-headings:text-slate-800 dark:prose-headings:text-slate-200 prose-a:font-medium prose-a:text-[#f26622] prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-800 dark:prose-strong:text-slate-100 prose-code:text-slate-800 prose-code:bg-transparent dark:prose-code:bg-slate-800 dark:prose-code:text-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700 prose-headings:scroll-mt-24 prose-img:rounded-lg prose-img:border prose-img:border-slate-200 dark:prose-img:border-slate-700">
              <CustomMDX source={page.content} />
            </article>
          </div>

          {/* Page navigation */}
          <PageNavigation prevArticle={[page.metadata.prevTitle, page.metadata.prevSlug]} nextArticle={[page.metadata.nextTitle, page.metadata.nextSlug]} />

          {/* Content footer */}
          <Footer />

        </div>

        {/* Secondary navigation */}
        <SecondaryNav />

      </article>
    </>
  )
}
