import ext from './ext';
import {Histories, History} from '../reducers';
import {getHostName, getPath} from '../utils/url';

export const getHistory = (host: string): Promise<Histories> => {
  return new Promise((resolve) => {
    ext.history.search({text: host}, (historyNodes) => {
      const items = historyNodes.filter((node) => {
        return getHostName(node.url) === host;
      }).map((node) => {
        return {
          title: node.title || '',
          url: node.url || '',
          path: getPath(node.url),
          lastVisitTime: node.lastVisitTime
        };
      });

      resolve({
        host,
        items
      });
    });
  });
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
