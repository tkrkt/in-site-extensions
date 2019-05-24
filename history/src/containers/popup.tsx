import * as React from "react";
import { connect } from "react-redux";

import AppBar from "../components/appBar";
import HistoryList from "../components/historylist";
import { Store, Page, Histories } from "../reducers";
import { openHistory, removeHistory, removeAllHistories } from "../actions";
import { isValid } from "../utils/url";

// props of redux state
interface StateProps {
  histories: Histories;
  page: Page;
}

// props of action-creator
interface DispatchProps {
  openHistory: typeof openHistory;
  removeHistory: typeof removeHistory;
  removeAllHistories: typeof removeAllHistories;
}

interface State {
  resultMessage?: string;
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
    removeAllHistories
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
      {content}
    </div>
  );
};

const mapStateToProps = (state: Store): StateProps => ({
  histories: state.histories,
  page: state.page
});

const mapDispatchToProps: DispatchProps = {
  openHistory,
  removeHistory,
  removeAllHistories
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupContainer);
