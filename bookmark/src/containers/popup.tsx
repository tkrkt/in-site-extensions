import * as React from "react";
import { connect } from "react-redux";

import {
  addBookmark,
  openBookmark,
  removeBookmark,
  sortBookmark,
  changeSubdomainVisibillity
} from "../actions";
import AppBar from "../components/appBar";
import BookmarkList from "../components/bookmarklist";
import { Host, Page, Store, PopupViewState, Hosts } from "../reducers";
import { isValid, getDomainName } from "../utils/url";
import ToolBar from "../components/toolBar";

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
    popupViewState: { includesSubdomain }
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
    const domain = getDomainName(page.result!.host.url);
    const subdomainKeys = Object.keys(hosts).filter(key => {
      return hosts[key].domain === domain && hosts[key].bookmarks.length > 0;
    });

    if (host && (host.bookmarks.length || subdomainKeys.length)) {
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

  return (
    <div className="popup">
      <AppBar
        page={page}
        isAlreadyAdded={isAlreadyAdded}
        isValidUrl={isValidUrl}
        onAdd={onAdd}
      />
      <ToolBar
        includesSubDomain={includesSubdomain}
        onSubdomainVisibillityChange={changeSubdomainVisibillity}
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
  changeSubdomainVisibillity
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupContainer);
