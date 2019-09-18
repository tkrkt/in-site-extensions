import * as React from "react";
import { MdDelete as DeleteIcon } from "react-icons/md";
import { MdOpenInNew as OpenInNewIcon } from "react-icons/md";
import { SortableElement } from "react-sortable-hoc";

import { Bookmark, Host } from "../reducers";

interface Props {
  host: Host;
  bookmark: Bookmark;
  isCurrent?: boolean;
  onSelect: (arg: {
    host: Host;
    bookmark: Bookmark;
    openInNew: boolean;
  }) => void;
  onRemove: (arg: { host: Host; bookmark: Bookmark }) => void;
}

const BookmarkItem = ({
  host,
  bookmark,
  isCurrent,
  onSelect,
  onRemove
}: Props) => {
  const onSelectHandler = React.useCallback(
    (e: any) => {
      if (e.button !== 1) {
        onSelect({ host, bookmark, openInNew: false });
      }
    },
    [onSelect, host, bookmark]
  );

  const onMiddleClickHandler = React.useCallback(
    (e: any) => {
      if (e.button === 1) {
        onSelect({ host, bookmark, openInNew: true });
      }
    },
    [onSelect, host, bookmark]
  );

  const onRemoveHandler = React.useCallback(
    (e: React.SyntheticEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onRemove({ host, bookmark });
    },
    [onRemove, host, bookmark]
  );

  const onOpenInNewHandler = React.useCallback(
    (e: React.SyntheticEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onSelect({ host, bookmark, openInNew: true });
    },
    [onSelect, host, bookmark]
  );

  const path = (window as any).decodeURIComponent(bookmark.path);
  const url = (window as any).decodeURIComponent(bookmark.url);

  return (
    <li
      className={isCurrent ? "bookmark bookmark_current" : "bookmark"}
      onClick={onSelectHandler}
      onMouseUp={onMiddleClickHandler}
    >
      <div className="bookmark__title">{bookmark.title}</div>
      <div className="bookmark__path" title={url}>
        {path}
      </div>
      <div className="bookmark__control">
        <button
          className="bookmark__button bookmark__button_open-in-new"
          title="Open in new tab"
          onClick={onOpenInNewHandler}
        >
          <OpenInNewIcon size={16} />
        </button>
        <button
          className="bookmark__button bookmark__button_delete"
          title="Delete"
          onClick={onRemoveHandler}
        >
          <DeleteIcon size={16} />
        </button>
      </div>
    </li>
  );
};

export default SortableElement(BookmarkItem);
