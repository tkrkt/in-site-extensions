import ext from './ext';
import storage from './storage';
import {Hosts, Host} from '../reducers';

export const setHost = (host: Host): Promise<void> => {
  return new Promise((resolve, reject) => {
    storage.set({
      [host.url]: host
    }, () => {
      if (ext.runtime.lastError) {
        reject(ext.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
};

export const removeHost = (host: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    storage.remove(host, () => {
      if (ext.runtime.lastError) {
        reject(ext.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
};

export const getAllHosts = (): Promise<Hosts> => {
  return new Promise((resolve, reject) => {
    storage.get(null, (item = {}) => {
      if (ext.runtime.lastError) {
        reject(ext.runtime.lastError);
      } else {
        resolve(item);
      }
    });
  });
};
