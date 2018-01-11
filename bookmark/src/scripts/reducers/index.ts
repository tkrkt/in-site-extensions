import {combineReducers, ReducersMapObject} from 'redux';

import hosts, {Hosts, Host, Bookmark} from './hosts';
import page, {Page} from './page';

export interface Store {
  hosts: Hosts;
  page: Page;
}

export type Hosts = Hosts;
export type Host = Host;
export type Bookmark = Bookmark;
export type Page = Page;

export default combineReducers<Store>({hosts, page} as ReducersMapObject);
