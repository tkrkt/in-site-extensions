import actionCreatorFactory from 'typescript-fsa';
import {Histories, History, Page} from '../reducers';

const actionCreator = actionCreatorFactory();

export const nop = actionCreator<{}>('NOP');

export const initialize = actionCreator<{}>('INITIALIZE');

export const loadHistory = actionCreator<{}>('LOAD_HISTORY');
export const loadMoreHistory = actionCreator<{}>('LOAD_MORE_HISTORY');
export const historyLoaded = actionCreator<{histories: Histories}>('HISTORY_LOADED');

export const openHistory = actionCreator<{history: History, openInNew: boolean}>('OPEN_HISTORY');
export const removeHistory = actionCreator<{history: History}>('REMOVE_HISTORY');
export const removeAllHistories = actionCreator<{host: string}>('REMOVE_ALL_HISTORIES');

export const pageChanged = actionCreator<{page: Page}>('PAGE_CHANGED');
