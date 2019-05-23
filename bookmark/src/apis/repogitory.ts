import { browser } from "webextension-polyfill-ts";
import { Host, Hosts } from "../reducers";
import { getDomainName } from "../utils/url";

export const setHost = (host: Host): Promise<void> => {
  return browser.storage.sync.set({
    [host.url]: host
  });
};

export const removeHost = (host: string): Promise<void> => {
  return browser.storage.sync.remove(host);
};

export const getAllHosts = async (): Promise<Hosts> => {
  const hosts: Hosts = await browser.storage.sync.get(null);
  Object.keys(hosts).forEach(key => {
    hosts[key].domain = getDomainName(hosts[key].url);
  });
  return hosts;
};
