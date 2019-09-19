import throttle from "lodash.throttle";
import { browser, Tabs } from "webextension-polyfill-ts";
import { Page } from "../reducers";
import { getHostName } from "../utils/url";

const getCurrentTab = async (): Promise<Tabs.Tab> => {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true
  });
  if (tabs && tabs.length) {
    return tabs[0];
  } else {
    throw new Error("Current tab not found");
  }
};

const watchTabChange = (handler: () => void): (() => void) => {
  const updateHandler = (_, changeInfo) => {
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
        host: getHostName(tab.url),
        url: tab.url,
        favicon: tab.favIconUrl || "",
        tabId: tab.id
      }
    };
  } else {
    throw new Error("Failed to extract tab");
  }
};

export const watchCurrentPage = (
  handler: (page: Page) => void
): (() => void) => {
  return watchTabChange(
    throttle(
      () => {
        getCurrentPage()
          .then(handler)
          .catch(() => {
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
