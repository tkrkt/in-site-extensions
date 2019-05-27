import { combineReducers, ReducersMapObject } from "redux";
import page, { Page } from "./page";
import histories, { History, Histories } from "./history";
import popupViewState, { PopupViewState } from "./popupViewState";

export interface Store {
  histories: Histories;
  page: Page;
  popupViewState: PopupViewState;
}

export type Histories = Histories;
export type History = History;
export type Page = Page;
export type PopupViewState = PopupViewState;

export default combineReducers<Store>({ page, histories, popupViewState } as ReducersMapObject);
