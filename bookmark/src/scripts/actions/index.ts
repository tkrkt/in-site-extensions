import actionCreatorFactory from 'typescript-fsa';
import {Hosts, Host, Bookmark, Page} from '../reducers';

const actionCreator = actionCreatorFactory();

export const nop = actionCreator<{}>('NOP');

export const initialize = actionCreator<{}>('INITIALIZE');
export const initHosts = actionCreator<Hosts>('INIT_HOSTS');

export const addBookmark = actionCreator<{page: Page}>('ADD_BOOKMARK');
export const addBookmarkWorker = actionCreator.async<{}, void, any>('ADD_BOOKMARK_WORKER');

export const openBookmark = actionCreator<{host: Host, bookmark: Bookmark, openInNew: boolean}>('OPEN_BOOKMARK');
export const removeBookmark = actionCreator<{host: Host, bookmark: Bookmark}>('REMOVE_BOOKMARK');
export const sortBookmark = actionCreator<{host: Host, bookmarks: Bookmark[]}>('SORT_BOOKMARK');

export const removeHost = actionCreator<{host: Host}>('REMOVE_HOST');

export const pageChanged = actionCreator<{page: Page}>('PAGE_CHANGED');
