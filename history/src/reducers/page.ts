import { Action } from "redux";
import { isType } from "typescript-fsa";
import { pageChanged } from "../actions";

export interface Page {
  result?: {
    host: string;
    url: string;
    favicon: string;
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
