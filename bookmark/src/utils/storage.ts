import { Bookmark, getHostName, getPath } from "./url";

const SYSTEM_KEY = "IN_SITE_BOOKMARKS_STORAGE_VERSION";

const VERSION = 2;

export const getVersion = async (): Promise<number> => {
  const system = await chrome.storage.local.get(SYSTEM_KEY);
  return +system[SYSTEM_KEY] || 1;
};

export const migrate = async (): Promise<void> => {
  const version = await getVersion();
  if (version === 1) {
    const hosts: {
      [host: string]: {
        url: string;
        favicon: string;
        bookmarks: Bookmark[];
      };
    } = await chrome.storage.sync.get(null);

    const newHosts: {
      [host: string]: Bookmark[];
    } = {};

    Object.keys(hosts).forEach((host) => {
      newHosts[host] = hosts[host].bookmarks;
    });

    await importBookmarks(newHosts);
  }

  await chrome.storage.local.set({
    [SYSTEM_KEY]: VERSION,
  });
};

export const saveBookmarks = (
  hostUrl: string,
  bookmarks: Bookmark[]
): Promise<void> => {
  return chrome.storage.local.set({
    [hostUrl]: bookmarks.filter((e) => !e.isBrowserBookmark),
  });
};

export const removeHost = (hostUrl: string): Promise<void> => {
  return chrome.storage.local.remove(hostUrl);
};

export const loadAllBookmarks = async (): Promise<{
  [host: string]: Bookmark[];
}> => {
  const allBookmarks = await chrome.storage.local.get(null);
  delete allBookmarks[SYSTEM_KEY];
  return allBookmarks || {};
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).loadAllBookmarks = loadAllBookmarks;

export const loadBookmarks = async (hostUrl: string): Promise<Bookmark[]> => {
  const bookmarks: Bookmark[] = [];

  (
    (await chrome.bookmarks.search({
      query: hostUrl,
    })) || []
  ).forEach((e) => {
    if (
      e.url &&
      getHostName(e.url) === hostUrl &&
      bookmarks.findIndex((b) => b.url === e.url) === -1
    ) {
      bookmarks.push({
        title: e.title || "",
        url: e.url,
        path: getPath(e.url),
        isBrowserBookmark: true,
      });
    }
  });

  ((await chrome.storage.local.get(hostUrl))[hostUrl] || []).forEach(
    (e: { url?: string; title: string }) => {
      if (e.url && bookmarks.findIndex((b) => b.url === e.url) === -1) {
        bookmarks.push({
          title: e.title || "",
          url: e.url,
          path: getPath(e.url),
        });
      }
    }
  );

  return bookmarks;
};

export const importBookmarks = async (bookmarks: {
  [host: string]: Bookmark[];
}) => {
  const currentBookmarks = await loadAllBookmarks();

  Object.entries(bookmarks).forEach(([hostUrl, bookmarks]) => {
    if (currentBookmarks[hostUrl]) {
      bookmarks.forEach((bookmark) => {
        if (
          !currentBookmarks[hostUrl].find((b) => b.url === bookmark.url) &&
          bookmark.url
        ) {
          currentBookmarks[hostUrl].push(bookmark);
        }
      });
    } else {
      currentBookmarks[hostUrl] = bookmarks;
    }
  });

  return chrome.storage.local.set(currentBookmarks);
};
