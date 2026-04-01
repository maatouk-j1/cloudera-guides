import { getDocPages } from '@/components/mdx/utils';
import { navigation, type NavItem } from './navigation';

export type SearchEntry = {
  title: string;
  slug: string;
  summary: string;
  section: string;
};

function findSectionForSlug(items: NavItem[], slug: string, parentTitle: string = ''): string {
  for (const item of items) {
    if (item.href === `/${slug}`) {
      return parentTitle || item.title;
    }
    if (item.children) {
      const found = findSectionForSlug(item.children, slug, parentTitle || item.title);
      if (found) return found;
    }
  }
  return '';
}

export function buildSearchIndex(): SearchEntry[] {
  const pages = getDocPages();
  return pages.map((page) => ({
    title: page.metadata.title || page.slug,
    slug: page.slug,
    summary: page.metadata.summary || '',
    section: findSectionForSlug(navigation, page.slug) || page.metadata.topicTitle || '',
  }));
}
