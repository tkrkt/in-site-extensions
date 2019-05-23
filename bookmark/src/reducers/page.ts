import { Action } from "redux";
import { isType } from "typescript-fsa";
import { pageChanged } from "../actions";
import { Bookmark } from "./hosts";

export interface Page {
  result?: {
    host: {
      url: string;
      favicon: string;
    };
    bookmark: Bookmark;
    tabId: number;
  };
  error?: any;
}

const initialState = {
  error: "not initialized"
};

export default (state: Partial<Page> = initialState, action: Action): Page => {
  if (isType(action, pageChanged)) {
    return {
      ...action.payload.page
    };
  }

  return state;
};
