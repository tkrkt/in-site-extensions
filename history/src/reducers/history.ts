import { Action } from "redux";
import { isType } from "typescript-fsa";
import { historyLoaded, removeHistory, removeAllHistories } from "../actions";

export interface History {
  title: string;
  url: string;
  path: string;
  lastVisitTime?: number;
}

export interface Histories {
  host: string;
  items: History[];
  paths: { [key: string]: boolean };
  endTime: number;
  completed?: boolean;
}

const initialState = {
  host: "",
  items: [],
  endTime: +new Date(),
  paths: {}
};

export default (state: Histories = initialState, action: Action) => {
  if (isType(action, historyLoaded)) {
    return {
      ...action.payload.histories
    };
  } else if (isType(action, removeHistory)) {
    return {
      ...state,
      items: state.items.filter(i => i.url !== action.payload.history.url)
    };
  } else if (isType(action, removeAllHistories)) {
    return {
      ...state,
      items: []
    };
  }
  return state;
};
