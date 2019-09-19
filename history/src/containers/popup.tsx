import * as React from "react";
import { connect } from "react-redux";

import AppBar from "../components/appBar";
import HistoryList from "../components/historylist";
import { Store, Page, Histories, PopupViewState } from "../reducers";
import {
  openHistory,
  removeHistory,
  removeAllHistories,
  changeSubdomainVisibillity
} from "../actions";
import { isValid } from "../utils/url";
import Toolbar from "../components/tollbar";
import popupViewState from "../reducers/popupViewState";

// props of redux state
interface StateProps {
  histories: Histories;
  page: Page;
  popupViewState: PopupViewState;
}

// props of action-creator
interface DispatchProps {
  openHistory: typeof openHistory;
  removeHistory: typeof removeHistory;
  removeAllHistories: typeof removeAllHistories;
  changeSubdomainVisibillity: typeof changeSubdomainVisibillity;
}

const isValidPageHistoryPair = (p: Page, h: Histories) => {
  return p && p.result && h && p.result.host === h.host;
};

const PopupContainer = (props: StateProps & DispatchProps) => {
  // tslint:disable:no-shadowed-variable
  const {
    page,
    histories,
    openHistory,
    removeHistory,
    removeAllHistories,
    changeSubdomainVisibillity,
    popupViewState: { includesSubdomain }
  } = props;

  let content: React.ReactNode;
  const isValidUrl = isValid(page.result && page.result.url);
  if (!isValidUrl) {
    content = (
      <div className="popup__content popup__content_no-content">
        {"Only http/https sites are supported."}
      </div>
    );
  } else if (
    isValidPageHistoryPair(page, histories) &&
    histories.items.length
  ) {
    content = (
      <div className="popup__content">
        <HistoryList
          page={page}
          histories={histories}
          onSelect={openHistory}
          onRemove={removeHistory}
        />
      </div>
    );
  } else {
    content = (
      <div className="popup__content popup__content_no-content">
        {"No histories on this site."}
      </div>
    );
  }

  const onRemoveAll = React.useCallback(
    () => page.result && removeAllHistories({ host: page.result.host }),
    [page.result]
  );

  return (
    <div className="popup">
      <AppBar page={page} isValidUrl={isValidUrl} onRemoveAll={onRemoveAll} />
      <Toolbar
        includesSubDomain={includesSubdomain}
        onSubdomainVisibillityChange={changeSubdomainVisibillity}
      />
      {content}
    </div>
  );
};

const mapStateToProps = (state: Store): StateProps => ({
  histories: state.histories,
  page: state.page,
  popupViewState: state.popupViewState
});

const mapDispatchToProps: DispatchProps = {
  openHistory,
  removeHistory,
  removeAllHistories,
  changeSubdomainVisibillity
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupContainer);
