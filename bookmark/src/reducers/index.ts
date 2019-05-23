import { combineReducers, ReducersMapObject } from "redux";

import hosts, { Bookmark, Host, Hosts } from "./hosts";
import page, { Page } from "./page";
import popupViewState, { PopupViewState } from "./popupViewState";

export interface Store {
  hosts: Hosts;
  page: Page;
  popupViewState: PopupViewState;
}

export type Hosts = Hosts;
export type Host = Host;
export type Bookmark = Bookmark;
export type Page = Page;
export type PopupViewState = PopupViewState;

export default combineReducers<Store>({
  hosts,
  page,
  popupViewState
} as ReducersMapObject);
