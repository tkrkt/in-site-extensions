import {Action} from 'redux';
import {isType} from 'typescript-fsa';
import {Host, Bookmark} from './hosts';
import {pageChanged} from '../actions';

export interface Page {
  result?: {
    host: Host;
    bookmark: Bookmark;
    tabId: number;
  };
  error?: any;
}

const initialState = {
  error: 'not initialized'
};

export default (state: Partial<Page> = initialState, action: Action) => {
  if (isType(action, pageChanged)) {
    return {
      ...action.payload.page
    };
  }

  return state;
};
