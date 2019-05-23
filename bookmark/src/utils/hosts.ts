import { Hosts, Page } from "../reducers";

export const getSubdomainHostKeys = (hosts: Hosts, page: Page): string[] => {
  return Object.keys(hosts)
    .filter(key => {
      return (
        hosts[key].domain === page.result!.host.domain &&
        hosts[key].url !== page.result!.host.url &&
        hosts[key].bookmarks.length > 0
      );
    })
    .sort();
};
