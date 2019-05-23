import * as React from "react";
import { SortableContainer, SortEndHandler } from "react-sortable-hoc";
import arrayMove from "array-move";
import { Bookmark, Host, Page } from "../reducers";
import BookmarkItem from "./bookmark";

interface InnerProps {
  host?: Host;
  page: Page;
  onSelect: (arg: {
    host: Host;
    bookmark: Bookmark;
    openInNew: boolean;
  }) => void;
  onRemove: (arg: { host: Host; bookmark: Bookmark }) => void;
  isSubdomain: boolean;
}

type Props = InnerProps & {
  onSortEnd: (arg: { host: Host; bookmarks: Bookmark[] }) => void;
};

const BookmarkListSectionInner = SortableContainer<InnerProps>((({
  host,
  page,
  onSelect,
  onRemove,
  isSubdomain
}: InnerProps) => {
  if (!page.result || !host) {
    return null;
  }
  const currentUrl = page.result.bookmark.url;
  const items = host.bookmarks.map((bookmark, index) => {
    return (
      <BookmarkItem
        key={`item-${bookmark.url}-${bookmark.path}`}
        host={host}
        index={index}
        collection={host.domain}
        isCurrent={currentUrl === bookmark.url}
        bookmark={bookmark}
        onSelect={onSelect}
        onRemove={onRemove}
      />
    );
  });

  let divider;
  if (isSubdomain) {
    divider = <li className="bookmark-list__divider">{host.url}</li>;
  }

  return (
    <ul className="bookmark-list">
      {divider}
      {items}
    </ul>
  );
}) as any);

const BookmarkListSection = (props: Props) => {
  const { host, onSortEnd } = props;

  const handleSortEnd: SortEndHandler = React.useCallback(
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

  const handleShouldCancelStart = React.useCallback((e: any) => {
    return !!(e.target && (e.target as Element).closest(".bookmark__control"));
  }, []);

  return (
    <BookmarkListSectionInner
      {...props}
      distance={4}
      onSortEnd={handleSortEnd}
      shouldCancelStart={handleShouldCancelStart}
    />
  );
};

export default BookmarkListSection;
