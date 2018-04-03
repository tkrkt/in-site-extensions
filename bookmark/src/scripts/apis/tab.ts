import * as throttle from 'lodash.throttle';
import ext from './ext';
import {Host, Bookmark, Page} from '../reducers';
import {getHostName, getPath} from '../utils/url';

const getCurrentTab = (): Promise<chrome.tabs.Tab> => {
  return new Promise((resolve, reject) => {
    ext.tabs.query({
      active: true,
      currentWindow: true
    }, (tabs) => {
      if (tabs && tabs.length) {
        resolve(tabs[0]);
      } else {
        reject('current tab not found');
      }
    });
  });
};

const watchTabChange = (handler: () => void): () => void => {
  const updateHandler = (_, changeInfo) => {
    if (changeInfo.url || changeInfo.title) {
      handler();
    }
  };
  ext.windows.onFocusChanged.addListener(handler);
  ext.tabs.onHighlighted.addListener(handler);
  ext.tabs.onUpdated.addListener(updateHandler);
  return () => {
    ext.windows.onFocusChanged.removeListener(handler);
    ext.tabs.onHighlighted.removeListener(handler);
    ext.tabs.onUpdated.removeListener(updateHandler);
  };
};

export const getCurrentPage = (): Promise<Page> => {
  return getCurrentTab().then((tab) => {
    if (tab.url && tab.title && typeof tab.id === 'number') {
      return {
        result: {
          host: {
            url: getHostName(tab.url),
            favicon: tab.favIconUrl || '',
            bookmarks: []
          },
          bookmark: {
            title: tab.title || 'Error',
            url: tab.url || 'Error',
            path: getPath(tab.url)
          },
          tabId: tab.id
        }
      };
    } else {
      return {
        error: 'Failed to extract tab'
      };
    }
  });
};

const samePage = (page1: Page, page2: Page): boolean => {
  if (!page1 || !page2 || !page1.result || !page2.result) {
    return false;
  }
  const p1 = page1.result;
  const p2 = page2.result;
  return (
    p1.tabId === p2.tabId
    && p1.host.url === p2.host.url
    && p1.host.favicon === p2.host.favicon
  );
};

export const watchCurrentPage = (handler: (page: Page) => void): () => void => {
  let previous: {url: string, title: string} = {url: '', title: ''};
  return watchTabChange(throttle(() => {
    getCurrentPage().then((page) => {
      if (page.result) {
        const same = (
          page.result.bookmark.url === previous.url
          && page.result.bookmark.title === previous.title
        );
        if (!same) {
          handler(page);
          previous = {
            url: page.result.bookmark.url,
            title: page.result.bookmark.title
          };
        }
      }
    }).catch((e) => {
      // nop (maybe Developer Tools' window for popup.html)
    });
  }, 100, {
    leading: false,
    trailing: true
  }));
};

export const openTab = (url: string, openLinkInNewTab?: boolean) => {
  return new Promise((resolve, reject) => {
    if (openLinkInNewTab) {
      ext.tabs.create({url}, () => {
        if (ext.runtime.lastError) {
          reject(ext.runtime.lastError);
        } else {
          resolve();
        }
      });
    } else {
      getCurrentTab().then((tab) => {
        if (tab.id) {
          ext.tabs.update(tab.id, {url}, () => {
            if (ext.runtime.lastError) {
              reject(ext.runtime.lastError);
            } else {
              resolve();
            }
          });
        } else {
          reject('Failed to get tab.id');
        }
      }).catch((e) => {
        reject(e);
      });
    }
  });
};

export const closePopup = () => {
  ext.extension.getViews({type: 'popup'}).forEach((w) => {
    w.close();
  });
};
