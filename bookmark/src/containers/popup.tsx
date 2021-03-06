import * as React from "react";
import { connect } from "react-redux";

import {
  addBookmark,
  openBookmark,
  removeBookmark,
  sortBookmark,
  changeSubdomainVisibillity,
  clearQuery,
  queryChanged
} from "../actions";
import AppBar from "../components/appBar";
import BookmarkList from "../components/bookmarkList";
import { Host, Page, Store, PopupViewState, Hosts } from "../reducers";
import { isValid } from "../utils/url";
import Toolbar from "../components/toolbar";
import { getSubdomainHostKeys } from "../utils/hosts";

// props of redux state
interface StateProps {
  host?: Host;
  hosts: Hosts;
  page: Page;
  popupViewState: PopupViewState;
}

// props of action-creator
interface DispatchProps {
  addBookmark: typeof addBookmark;
  openBookmark: typeof openBookmark;
  removeBookmark: typeof removeBookmark;
  sortBookmark: typeof sortBookmark;
  changeSubdomainVisibillity: typeof changeSubdomainVisibillity;
  queryChanged: typeof queryChanged;
  clearQuery: typeof clearQuery;
}

interface State {
  resultMessage?: string;
}

const PopupContainer = (props: StateProps & DispatchProps) => {
  // tslint:disable:no-shadowed-variable
  const {
    page,
    host,
    hosts,
    addBookmark,
    openBookmark,
    removeBookmark,
    sortBookmark,
    changeSubdomainVisibillity,
    queryChanged,
    clearQuery,
    popupViewState: { includesSubdomain, query }
  } = props;

  let isAlreadyAdded = false;
  let isValidUrl = false;
  if (page.result) {
    const currentUrl = page.result.bookmark.url;
    if (host && host.bookmarks.some(({ url }) => url === currentUrl)) {
      isAlreadyAdded = true;
    }
    isValidUrl = isValid(currentUrl);
  }

  let content;
  if (!isValidUrl) {
    content = (
      <div className="popup__content popup__content_no-content">
        {"Only http/https sites are supported."}
      </div>
    );
  } else if (includesSubdomain) {
    const subdomainKeys = getSubdomainHostKeys(hosts, page);
    if ((host && host.bookmarks.length) || subdomainKeys.length) {
      const subdomainHosts = subdomainKeys.reduce(
        (acc, key) => {
          acc[key] = hosts[key];
          return acc;
        },
        {} as Hosts
      );
      content = (
        <div className="popup__content">
          <BookmarkList
            page={page}
            host={host}
            onSelect={openBookmark}
            onRemove={removeBookmark}
            onSortEnd={sortBookmark}
            includesSubdomain={true}
            subdomainHosts={subdomainHosts}
            query={query}
          />
        </div>
      );
    } else {
      content = (
        <div className="popup__content popup__content_no-content">
          {"No bookmarks on this domain."}
        </div>
      );
    }
  } else {
    if (host && host.bookmarks.length && page.result) {
      content = (
        <div className="popup__content">
          <BookmarkList
            page={page}
            host={host}
            onSelect={openBookmark}
            onRemove={removeBookmark}
            onSortEnd={sortBookmark}
            includesSubdomain={false}
            subdomainHosts={{}}
            query={query}
          />
        </div>
      );
    } else {
      content = (
        <div className="popup__content popup__content_no-content">
          {"No bookmarks on this site."}
        </div>
      );
    }
  }

  const onAdd = () => addBookmark({ page });
  const onClear = () => clearQuery();

  return (
    <div className="popup">
      <AppBar
        page={page}
        isAlreadyAdded={isAlreadyAdded}
        isValidUrl={isValidUrl}
        onAdd={onAdd}
      />
      <Toolbar
        includesSubDomain={includesSubdomain}
        onSubdomainVisibillityChange={changeSubdomainVisibillity}
        query={query}
        onChange={queryChanged}
        onClear={onClear}
      />
      {content}
    </div>
  );
};

const mapStateToProps = (state: Store): StateProps => ({
  host: state.page.result && state.hosts[state.page.result.host.url],
  hosts: state.hosts,
  page: state.page,
  popupViewState: state.popupViewState
});

const mapDispatchToProps: DispatchProps = {
  addBookmark,
  openBookmark,
  removeBookmark,
  sortBookmark,
  changeSubdomainVisibillity,
  queryChanged,
  clearQuery
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupContainer);
