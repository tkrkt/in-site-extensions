export interface Bookmark {
  title: string;
  url: string;
  path: string;
  isBrowserBookmark?: boolean;
}

export interface Host {
  url: string;
  favicon: string;
}

export interface PageState {
  host: Host;
  bookmark: Bookmark;
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
