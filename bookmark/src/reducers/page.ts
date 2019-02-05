import { Action } from "redux";
import { isType } from "typescript-fsa";
import { pageChanged } from "../actions";
import { Bookmark, Host } from "./hosts";

export interface Page {
  result?: {
    host: Host;
    bookmark: Bookmark;
    tabId: number;
  };
  error?: any;
}

const initialState = {
  error: "not initialized"
};

export default (state: Partial<Page> = initialState, action: Action) => {
  if (isType(action, pageChanged)) {
    return {
      ...action.payload.page
    };
  }

  return state;
};
