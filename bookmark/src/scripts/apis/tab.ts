import * as throttle from 'lodash.throttle';
import ext from './ext';
import {Host, Bookmark, Page} from '../reducers';

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
      const url = new URL(tab.url);
      return {
        result: {
          host: {
            url: url.host,
            favicon: tab.favIconUrl || '',
            bookmarks: []
          },
          bookmark: {
            title: tab.title || 'Error',
            url: tab.url || 'Error',
            path: url.pathname + url.search + url.hash
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

export const watchCurrentPage = (handler: (page: Page) => void): () => void => {
  return watchTabChange(throttle(() => {
    getCurrentPage().then(handler).catch(() => {
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
