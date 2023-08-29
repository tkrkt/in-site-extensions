import { getHostName, isValid } from "./utils/url";
import { loadBookmarks, migrate } from "./utils/storage";

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "update") {
    migrate();
  }
});

const getCurrentTabUrl = async () => {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  return tabs[0].url;
};

const setBadgeText = async (url: string) => {
  if (!isValid(url)) {
    await chrome.action.setBadgeText({ text: "" });
    return;
  }

  const bookmarks = await loadBookmarks(getHostName(url));
  chrome.action.setBadgeText({
    text: bookmarks.length ? bookmarks.length.toString() : "",
  });
};

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab && tab.url) {
    setBadgeText(tab.url);
  }
});

chrome.bookmarks.onCreated.addListener(async (_, bookmark) => {
  const tabUrl = await getCurrentTabUrl();
  if (tabUrl && getHostName(bookmark.url) === getHostName(tabUrl)) {
    setBadgeText(tabUrl);
  }
});

chrome.bookmarks.onRemoved.addListener(async () => {
  const tabUrl = await getCurrentTabUrl();
  if (tabUrl) {
    setBadgeText(tabUrl);
  }
});

chrome.storage.local.onChanged.addListener(async (changes) => {
  const tabUrl = await getCurrentTabUrl();

  if (tabUrl && Object.keys(changes).includes(getHostName(tabUrl))) {
    setBadgeText(tabUrl);
  }
});
