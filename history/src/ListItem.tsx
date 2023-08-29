import openInNewIcon from "./images/open_in_new.svg";
import deleteIcon from "./images/delete_black.svg";
import "./ListItem.css";
import { MouseEvent } from "react";
import { History } from "./history";

function ListItem({
  history,
  isCurrent,
  onDelete,
}: {
  history: History;
  isCurrent: boolean;
  onDelete: (history: History) => void;
}) {
  const handleListClick = (e: MouseEvent) => {
    if (e.button === 1) {
      chrome.tabs.create({ url: history.url }, window.close);
    } else {
      chrome.tabs.update({ url: history.url }, window.close);
    }
  };

  const handleOpenInNewTabClick = (e: MouseEvent) => {
    e.stopPropagation();
    chrome.tabs.create({ url: history.url }, window.close);
  };

  const handleDeleteClick = (e: MouseEvent) => {
    e.stopPropagation();
    onDelete(history);
  };

  return (
    <div className="ListItem-root" onClick={handleListClick}>
      <div
        className="ListItem-title"
        style={{
          color: isCurrent ? "var(--color-primary-text)" : "black",
        }}
      >
        {history.title}
      </div>
      <div className="ListItem-url">{history.path}</div>
      <div className="ListItem-controls">
        <div
          className="ListItem-control ListItem-control-open"
          title="Open in new tab"
          onClick={handleOpenInNewTabClick}
        >
          <img src={openInNewIcon} />
        </div>
        <div
          className="ListItem-control ListItem-control-delete"
          title="Delete"
          onClick={handleDeleteClick}
        >
          <img src={deleteIcon} />
        </div>
      </div>
    </div>
  );
}

export default ListItem;
