import * as React from "react";
import { connect } from "react-redux";

import {
  addBookmark,
  openBookmark,
  removeBookmark,
  sortBookmark
} from "../actions";
import AppBar from "../components/appBar";
import BookmarkList from "../components/bookmarklist";
import { Host, Page, Store } from "../reducers";
import { isValid } from "../utils/url";

// props of redux state
interface StateProps {
  host?: Host;
  page: Page;
}

// props of action-creator
interface DispatchProps {
  addBookmark: typeof addBookmark;
  openBookmark: typeof openBookmark;
  removeBookmark: typeof removeBookmark;
  sortBookmark: typeof sortBookmark;
}

interface State {
  resultMessage?: string;
}

const PopupContainer = (props: StateProps & DispatchProps) => {
  // tslint:disable:no-shadowed-variable
  const {
    page,
    host,
    addBookmark,
    openBookmark,
    removeBookmark,
    sortBookmark
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
  } else if (host && host.bookmarks.length && page.result) {
    content = (
      <div className="popup__content">
        <BookmarkList
          page={page}
          host={host}
          onSelect={openBookmark}
          onRemove={removeBookmark}
          onSortEnd={sortBookmark}
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

  const onAdd = () => addBookmark({ page });

  return (
    <div className="popup">
      <AppBar
        page={page}
        isAlreadyAdded={isAlreadyAdded}
        isValidUrl={isValidUrl}
        onAdd={onAdd}
      />
      {content}
    </div>
  );
};

const mapStateToProps = (state: Store): StateProps => ({
  host: state.page.result && state.hosts[state.page.result.host.url],
  page: state.page
});

const mapDispatchToProps: DispatchProps = {
  addBookmark,
  openBookmark,
  removeBookmark,
  sortBookmark
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupContainer);
