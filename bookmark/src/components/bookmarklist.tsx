import * as React from "react";
import {
  arrayMove,
  SortableContainer,
  SortEndHandler
} from "react-sortable-hoc";
import { Bookmark, Host, Page } from "../reducers";
import BookmarkItem from "./bookmark";

interface Props {
  host?: Host;
  page: Page;
  onSelect: (arg: {
    host: Host;
    bookmark: Bookmark;
    openInNew: boolean;
  }) => void;
  onRemove: (arg: { host: Host; bookmark: Bookmark }) => void;
  onSortEnd: (arg: { host: Host; bookmarks: Bookmark[] }) => void;
}

const SortableList = SortableContainer((({
  host,
  page,
  onSelect,
  onRemove
}: Props) => {
  if (page.result && (host && host.bookmarks.length)) {
    const currentUrl = page.result.bookmark.url;
    return (
      <ul className="bookmark-list">
        {host.bookmarks.map((bookmark, index) => {
          return (
            <BookmarkItem
              key={`item-${index}`}
              host={host}
              index={index}
              isCurrent={currentUrl === bookmark.url}
              bookmark={bookmark}
              onSelect={onSelect}
              onRemove={onRemove}
            />
          );
        })}
      </ul>
    );
  }
}) as any); // FIXME

const shouldCancel = (e: any) => {
  return !!(e.target && (e.target as Element).closest(".bookmark__control"));
};

const BookmarkList = (props: Props) => {
  const { host, onSortEnd } = props;

  const sortEndHandler: SortEndHandler = React.useCallback(
    ({ oldIndex, newIndex }) => {
      if (host) {
        onSortEnd({
          host,
          bookmarks: arrayMove(host.bookmarks, oldIndex, newIndex)
        });
      } else {
        throw new Error(
          "Unexpected operation! Bookmarks are sorted but host is undefined."
        );
      }
    },
    [host, onSortEnd]
  );

  return (
    <SortableList
      {...props}
      distance={4}
      onSortEnd={sortEndHandler}
      shouldCancelStart={shouldCancel}
    />
  );
};

export default BookmarkList;
