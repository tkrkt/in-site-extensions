import { browser } from "webextension-polyfill-ts";
import { Host, Hosts } from "../reducers";

export const setHost = (host: Host): Promise<void> => {
  return browser.storage.sync.set({
    [host.url]: host
  });
};

export const removeHost = (host: string): Promise<void> => {
  return browser.storage.sync.remove(host);
};

export const getAllHosts = (): Promise<Hosts> => {
  return browser.storage.sync.get(null);
};
