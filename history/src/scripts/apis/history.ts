import ext from './ext';
import {Histories, History} from '../reducers';
import {getHostName, getPath} from '../utils/url';

const maxResults = 100;

const searchHistory = ({
  host,
  paths,
  items,
  endTime
}: Histories): Promise<Histories> => {
  return new Promise((resolve) => {
    ext.history.search({
      text: host,
      startTime: 0,
      endTime,
      maxResults
    }, (historyNodes) => {
      let nextEndTime = endTime;
      historyNodes.filter((node) => {
        return getHostName(node.url) === host;
      }).map((node) => {
        return {
          title: node.title || '',
          url: node.url || '',
          path: getPath(node.url),
          lastVisitTime: node.lastVisitTime
        };
      }).forEach((h) => {
        if (paths[h.path]) {
          // nop (already added)
        } else if (h.lastVisitTime) {
          paths[h.path] = true;
          items.push(h);
          nextEndTime = Math.min(nextEndTime, h.lastVisitTime);
        }
      });

      const completed = endTime === nextEndTime || !items.length;
      resolve({
        host,
        items,
        paths,
        endTime: nextEndTime - 1,
        completed
      });
    });
  });
};

export const getHistory = (host: string): Promise<Histories> => {
  return searchHistory({
    host,
    paths: {},
    items: [],
    endTime: +new Date()
  });
};

export const getMoreHistory = (histories: Histories): Promise<Histories> => {
  return searchHistory(histories);
};

export const removeHistory = (history: History): Promise<void> => {
  return new Promise((resolve) => {
    ext.history.deleteUrl({url: history.url}, resolve);
  });
};

export const removeAllHistories = (host: string): Promise<void[]> => {
  return getHistory(host).then((histories) => {
    return Promise.all(histories.items.map((h) => removeHistory(h)));
  });
};
