import { Action } from "redux";
import { isType } from "typescript-fsa";
import {
  changeSubdomainVisibillity,
  pageChanged,
  clearQuery,
  queryChanged,
  popupLoaded
} from "../actions";

export interface PopupViewState {
  includesSubdomain: boolean;
  query: string;
}

const initialState = {
  includesSubdomain: false,
  query: ""
};

export default (
  state: PopupViewState = initialState,
  action: Action
): PopupViewState => {
  if (isType(action, changeSubdomainVisibillity)) {
    return {
      ...state,
      includesSubdomain: action.payload.visible
    };
  }

  if (isType(action, queryChanged)) {
    return {
      ...state,
      query: action.payload.query
    };
  }

  if (isType(action, clearQuery)) {
    return {
      ...state,
      query: ""
    };
  }

  if (isType(action, popupLoaded)) {
    return {
      ...state,
      query: ""
    };
  }

  return state;
};
