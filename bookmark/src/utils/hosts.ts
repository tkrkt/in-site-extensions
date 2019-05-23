import { Hosts, Page, Bookmark } from "../reducers";

export const getSubdomainHostKeys = (hosts: Hosts, page: Page): string[] => {
  return Object.keys(hosts)
    .filter(key => {
      return (
        hosts[key].domain === page.result!.host.domain &&
        hosts[key].url !== page.result!.host.url &&
        hosts[key].bookmarks.length > 0
      );
    })
    .sort();
};

export const matchesQuery = (bookmark: Bookmark, query: string): boolean => {
  const trimmedQuery = query.trim().toLowerCase();
  return (
    !trimmedQuery ||
    bookmark.url.toLowerCase().includes(trimmedQuery) ||
    bookmark.path.toLowerCase().includes(trimmedQuery) ||
    bookmark.title.toLowerCase().includes(trimmedQuery)
  );
};
