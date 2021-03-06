import { Action } from "redux";
import { isType } from "typescript-fsa";
import { changeSubdomainVisibillity } from "../actions";

export interface PopupViewState {
  includesSubdomain: boolean;
}

const initialState = {
  includesSubdomain: false
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

  return state;
};
