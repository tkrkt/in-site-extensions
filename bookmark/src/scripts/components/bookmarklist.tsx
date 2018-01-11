import * as React from 'react';
import {SortableContainer, arrayMove} from 'react-sortable-hoc';
import {Host, Bookmark, Page} from '../reducers';
import BookmarkItem from './bookmark';

interface OnSortEndArg {
  host: Host;
  bookmarks: Bookmark[];
}

interface Props {
  host?: Host;
  page: Page;
  onSelect: (arg: {host: Host, bookmark: Bookmark, openInNew: boolean}) => void;
  onRemove: (arg: {host: Host, bookmark: Bookmark}) => void;
  onSortEnd: (arg: {host: Host, bookmarks: Bookmark[]}) => void;
}

const SortableList = SortableContainer(({
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
              onRemove={onRemove} />
          );
        })}
      </ul>
    );
  }
});

const shouldCancel = (e) => {
  return e.target.closest('.bookmark__control');
};

const BookmarkList = (props: Props) => {
  const {onSortEnd, host} = props;

  const sortEndHandler = ({oldIndex, newIndex}) => {
    if (host) {
      onSortEnd({
        host,
        bookmarks: arrayMove(host.bookmarks, oldIndex, newIndex)
      });
    } else {
      throw new Error('Unexpected operation! Bookmarks are sorted but host is undefined.');
    }
  };

  return (
    <SortableList
      {...props}
      distance={4}
      onSortEnd={sortEndHandler}
      shouldCancelStart={shouldCancel} />
  );
};

export default BookmarkList;
