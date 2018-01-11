import ext from './ext';
import storage from './storage';
import {Hosts, Host} from '../reducers';

export const setHost = (host: Host): Promise<void> => {
  console.log('setHost', host);
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
  console.log('removeHost', host);
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
  console.log('getAllHosts');
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
