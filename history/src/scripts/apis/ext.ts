declare const browser: typeof chrome;

const apis = [
  'alarms',
  'bookmarks',
  'browserAction',
  'commands',
  'contextMenus',
  'cookies',
  'downloads',
  // 'events',
  'extension',
  'extensionTypes',
  'history',
  'i18n',
  'idle',
  'notifications',
  'pageAction',
  'runtime',
  'storage',
  'tabs',
  'webNavigation',
  'webRequest',
  'windows'
] as Array<keyof Extension>;

class Extension {
  public alerms: typeof chrome.alarms;
  public bookmarks: typeof chrome.bookmarks;
  public browserAction: typeof chrome.browserAction;
  public commands: typeof chrome.commands;
  public contextMenus: typeof chrome.contextMenus;
  public cookies: typeof chrome.cookies;
  public downloads: typeof chrome.downloads;
  // events: typeof chrome.events
  public extension: typeof chrome.extension;
  // extensionTypes: typeof chrome.extensionTypes
  public history: typeof chrome.history;
  public i18n: typeof chrome.i18n;
  public idle: typeof chrome.idle;
  public nortifications: typeof chrome.notifications;
  public pageAction: typeof chrome.pageAction;
  public runtime: typeof chrome.runtime;
  public storage: typeof chrome.storage;
  public tabs: typeof chrome.tabs;
  public webNavigation: typeof chrome.webNavigation;
  public webRequest: typeof chrome.webRequest;
  public windows: typeof chrome.windows;

  constructor() {
    apis.forEach((api: keyof Extension) => {
      // tslint:disable:strict-type-predicates
      if (typeof chrome !== 'undefined') {
        this[api] = chrome[api];
      }
      // tslint:disable:strict-type-predicates
      if (typeof window !== 'undefined' && window[api]) {
        this[api] = chrome[api];
      }
      // tslint:disable:strict-type-predicates
      if (typeof browser !== 'undefined') {
        if (browser.extension && browser.extension[api]) {
          this[api] = browser.extension[api];
        } else if (browser[api]) {
          this[api] = browser[api];
        }
      }
    });

    // tslint:disable:strict-type-predicates
    if (typeof browser !== 'undefined') {
      if (browser.runtime) {
        this.runtime = browser.runtime;
      }
      if (browser.browserAction) {
        this.browserAction = browser.browserAction;
      }
    }
  }
}

export default new Extension();
