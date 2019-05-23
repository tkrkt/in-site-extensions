import throttle = require("lodash.throttle");
import { browser, Tabs } from "webextension-polyfill-ts";
import { Page } from "../reducers";
import { getHostName, getPath } from "../utils/url";

const getCurrentTab = async (): Promise<Tabs.Tab> => {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true
  });
  if (tabs.length) {
    return tabs[0];
  } else {
    throw new Error("current tab not found");
  }
};

const watchTabChange = (handler: () => void): (() => void) => {
  const updateHandler = (_: any, changeInfo: any) => {
    if (changeInfo.url || changeInfo.title) {
      handler();
    }
  };

  browser.windows.onFocusChanged.addListener(handler);
  browser.tabs.onHighlighted.addListener(handler);
  browser.tabs.onUpdated.addListener(updateHandler);

  return () => {
    browser.windows.onFocusChanged.removeListener(handler);
    browser.tabs.onHighlighted.removeListener(handler);
    browser.tabs.onUpdated.removeListener(updateHandler);
  };
};

export const getCurrentPage = async (): Promise<Page> => {
  const tab = await getCurrentTab();
  if (tab.url && tab.title && typeof tab.id === "number") {
    return {
      result: {
        host: {
          url: getHostName(tab.url),
          favicon: tab.favIconUrl || ""
        },
        bookmark: {
          title: tab.title || "Error",
          url: tab.url || "Error",
          path: getPath(tab.url)
        },
        tabId: tab.id
      }
    };
  } else {
    throw new Error("Failed to extract tab");
  }
};

const isSamePage = (page1: Page, page2: Page) => {
  if (page1.result && page2.result) {
    return (
      page1.result.bookmark.url === page2.result.bookmark.url &&
      page1.result.bookmark.title === page2.result.bookmark.title &&
      page1.result.host.favicon === page2.result.host.favicon
    );
  } else {
    return false;
  }
};

export const watchCurrentPage = (
  handler: (page: Page) => void
): (() => void) => {
  let previous: Page = {
    result: {
      host: {
        url: "",
        favicon: ""
      },
      bookmark: {
        title: "",
        url: "",
        path: ""
      },
      tabId: -1
    }
  };

  return watchTabChange(
    throttle(
      () => {
        getCurrentPage()
          .then(page => {
            if (page.result && !isSamePage(page, previous)) {
              handler(page);
              previous = page;
            }
          })
          .catch(e => {
            // nop (maybe Developer Tools' window for popup.html)
          });
      },
      100,
      {
        leading: false,
        trailing: true
      }
    )
  );
};

export const openTab = async (url: string, openLinkInNewTab?: boolean) => {
  if (openLinkInNewTab) {
    await browser.tabs.create({ url });
  } else {
    const tab = await getCurrentTab();
    if (tab.id) {
      await browser.tabs.update(tab.id, { url });
    } else {
      throw new Error("Failed to get tab.id");
    }
  }
};

export const closePopup = () => {
  browser.extension.getViews({ type: "popup" }).forEach(w => {
    w.close();
  });
};
