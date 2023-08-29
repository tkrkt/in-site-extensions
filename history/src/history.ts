import { getHostName, getPath } from "./url";

const maxResults = 100;

export interface History {
  title: string;
  url: string;
  path: string;
  lastVisitTime?: number;
}

export interface Histories {
  host: string;
  items: History[];
  paths: { [key: string]: boolean };
  endTime: number;
  completed?: boolean;
}

const searchHistory = async ({
  host,
  items,
  paths,
  endTime,
}: Histories): Promise<Histories> => {
  let historyNodes = await chrome.history.search({
    text: host,
    startTime: 0,
    endTime,
    maxResults,
  });

  let nextEndTime = endTime;
  historyNodes = historyNodes.filter((node) => {
    if (node.lastVisitTime) {
      nextEndTime = Math.min(nextEndTime, node.lastVisitTime);
      return true;
    } else {
      return false;
    }
  });

  const newItems = [
    ...items,
    ...historyNodes
      .filter((node) => {
        if (getHostName(node.url) === host) {
          const path = getPath(node.url);
          if (paths[path]) {
            return false;
          }
          paths[path] = true;
          return true;
        } else {
          return false;
        }
      })
      .map((node) => {
        return {
          title: node.title || "",
          url: node.url || "",
          path: getPath(node.url),
          lastVisitTime: node.lastVisitTime,
        };
      }),
  ];

  return {
    host,
    paths,
    items: newItems,
    endTime: nextEndTime - 1,
    completed: historyNodes.length < maxResults,
  };
};

export const getHistory = (host: string): Promise<Histories> => {
  return searchHistory({
    host,
    paths: {},
    items: [],
    endTime: +new Date(),
  });
};

export const getMoreHistory = (histories: Histories): Promise<Histories> => {
  return searchHistory(histories);
};

export const removeHistory = (history: History): Promise<void> => {
  return chrome.history.deleteUrl({ url: history.url });
};

export const removeAllHistories = (histories: Histories): Promise<void[]> => {
  return Promise.all(histories.items.map((h) => removeHistory(h)));
};
