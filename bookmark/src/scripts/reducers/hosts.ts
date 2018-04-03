import {Action} from 'redux';
import {isType} from 'typescript-fsa';
import {
  setHosts,
  addBookmark,
  removeBookmark,
  sortBookmark,
  removeHost
} from '../actions';

export interface Bookmark {
  title: string;
  url: string;
  path: string;
}

export interface Host {
  url: string;
  favicon: string;
  bookmarks: Bookmark[];
}

export interface Hosts {
  [host: string]: Host;
}

const initialState: Hosts = {
};

export default (state: Hosts = initialState, action: Action) => {
  if (isType(action, setHosts)) {
    return {
      ...state,
      ...action.payload
    };
  }

  if (isType(action, addBookmark)) {
    const page = action.payload.page.result;
    if (page) {
      let currentBookmark;
      if (state[page.host.url]) {
        currentBookmark = state[page.host.url].bookmarks.filter((b) => b.url !== page.bookmark.url);
      } else {
        currentBookmark = [];
      }
      return {
        ...state,
        [page.host.url]: {
          url: page.host.url,
          favicon: page.host.favicon,
          bookmarks: [...currentBookmark, page.bookmark]
        }
      };
    } else {
      throw new Error('Do not call addBookmark without page.result');
    }
  }

  if (isType(action, removeBookmark)) {
    const {host, bookmark} = action.payload;
    const nextBookmarks = host.bookmarks.filter((b) => b.url !== bookmark.url);
    if (nextBookmarks.length) {
      return {
        ...state,
        [host.url]: {
          ...state[host.url],
          bookmarks: nextBookmarks
        }
      };
    } else {
      const nextState = {...state};
      delete nextState[host.url];
      return nextState;
    }
  }

  if (isType(action, sortBookmark)) {
    const {host, bookmarks} = action.payload;
    return {
      ...state,
      [host.url]: {
        ...state[host.url],
        bookmarks
      }
    };
  }

  if (isType(action, removeHost)) {
    const {host} = action.payload;
    const nextState = {...state};
    delete nextState[host.url];
    return nextState;
  }

  return state;
};
