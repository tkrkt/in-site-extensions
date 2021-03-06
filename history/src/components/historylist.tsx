import * as React from "react";
import { Page, Histories, History } from "../reducers";
import HistoryItem from "./history";
import { MdRefresh as RefreshIcon } from "react-icons/md";

interface Props {
  page: Page;
  histories: Histories;
  onSelect: (arg: { history: History; openInNew: boolean }) => void;
  onRemove: (arg: { history: History }) => void;
}

const HistoryList = ({ page, histories, onSelect, onRemove }: Props) => {
  if (page.result) {
    const currentUrl = page.result.url;
    return (
      <ul className="history-list">
        {histories.items.map(history => {
          return (
            <HistoryItem
              key={`item-${history.path}`}
              history={history}
              isCurrent={currentUrl === history.url}
              onSelect={onSelect}
              onRemove={onRemove}
            />
          );
        })}
        {!histories.completed && (
          <li className={"hostory history--loader"}>
            <RefreshIcon />
          </li>
        )}
      </ul>
    );
  } else {
    return null;
  }
};

export default HistoryList;
