export interface Bookmark {
  title: string;
  url: string;
  path: string;
}

export interface Host {
  url: string;
  favicon: string;
  bookmarks: Bookmark[];
}

export interface PageState {
  host: Omit<Host, "bookmarks">;
  bookmark: Bookmark;
}

export interface Hosts {
  [host: string]: Host;
}

export const getPageStateFromTab = (tab: chrome.tabs.Tab) => {
  return {
    host: {
      url: getHostName(tab.url),
      favicon: tab.favIconUrl || "",
    },
    bookmark: {
      title: tab.title || "Error",
      url: tab.url || "Error",
      path: getPath(tab.url),
    },
  };
};

export const getHostName = (url?: string | URL): string => {
  if (!url) {
    return "";
  } else if (typeof url === "string") {
    url = new URL(url);
  }
  return url.hostname;
};

export const getPath = (url?: string | URL): string => {
  if (!url) {
    return "";
  } else if (typeof url === "string") {
    url = new URL(url);
  }
  return url.pathname + url.search + url.hash;
};

export const isValid = (url: string | undefined): boolean => {
  return !!url && /^http/.test(url);
};
