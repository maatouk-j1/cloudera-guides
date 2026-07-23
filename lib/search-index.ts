import { getDocPages } from '@/components/mdx/utils';
import { navigation, type NavItem } from './navigation';

export type SearchEntry = {
  title: string;
  slug: string;
  section: string;
};

const BREADCRUMB_SEPARATOR = ' › ';

/**
 * The full trail of nav ancestors, e.g.
 * "CDP Private Cloud › Installations › CDP 7.3.2 › Setup Cloudera Manager Server".
 *
 * This used to return only the top-most ancestor, which made every page under
 * Installations read "CDP Private Cloud" — indistinguishable once a second
 * version of the guide landed (issue #55). The trail also feeds the search
 * match text, so "cdp 7.3.2 ldap" now narrows to that release.
 */
function findSectionForSlug(items: NavItem[], slug: string, trail: string[] = []): string {
  for (const item of items) {
    if (item.href === `/${slug}`) {
      // A top-level page has no ancestors, so it labels itself.
      return trail.length ? trail.join(BREADCRUMB_SEPARATOR) : item.title;
    }
    if (item.children) {
      const found = findSectionForSlug(item.children, slug, [...trail, item.title]);
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
    section: findSectionForSlug(navigation, page.slug) || page.metadata.topicTitle || '',
  }));
}
