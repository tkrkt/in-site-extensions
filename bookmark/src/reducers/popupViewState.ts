import { Action } from "redux";
import { isType } from "typescript-fsa";
import { changeSubdomainVisibillity, pageChanged } from "../actions";

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

  if (isType(action, pageChanged)) {
    return {
      ...initialState,
      includesSubdomain: state.includesSubdomain
    };
  }

  return state;
};
