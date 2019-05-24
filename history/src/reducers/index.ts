import { combineReducers, ReducersMapObject } from "redux";
import page, { Page } from "./page";
import histories, { History, Histories } from "./history";

export interface Store {
  histories: Histories;
  page: Page;
}

export type Histories = Histories;
export type History = History;
export type Page = Page;

export default combineReducers<Store>({ page, histories } as ReducersMapObject);
