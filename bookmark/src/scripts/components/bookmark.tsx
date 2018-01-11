import * as React from 'react';
import {SortableElement} from 'react-sortable-hoc';
import {bind} from 'decko';
import * as OpenInNewIcon from 'react-icons/lib/md/open-in-new';
import * as DeleteIcon from 'react-icons/lib/md/delete';

import {Host, Bookmark} from '../reducers';

interface Props {
  host: Host;
  bookmark: Bookmark;
  isCurrent?: boolean;
  onSelect: (arg: {host: Host, bookmark: Bookmark, openInNew: boolean}) => void;
  onRemove: (arg: {host: Host, bookmark: Bookmark}) => void;
}

const BookmarkItem = ({
  host,
  bookmark,
  isCurrent,
  onSelect,
  onRemove
}: Props) => {
  const onSelectHandler = () => {
    onSelect({host, bookmark, openInNew: false});
  };
  const onRemoveHandler = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onRemove({host, bookmark});
  };
  const onOpenInNewHandler = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onSelect({host, bookmark, openInNew: true});
  };

  const path = (window as any).decodeURIComponent(bookmark.path);
  const url = (window as any).decodeURIComponent(bookmark.url);

  return (
    <li
      className={isCurrent ? 'bookmark bookmark_current' : 'bookmark'}
      onClick={onSelectHandler}>
      <div className="bookmark__title">{bookmark.title}</div>
      <div className="bookmark__path" title={url}>{path}</div>
      <div className="bookmark__control">
        <button
          className="bookmark__button bookmark__button_open-in-new"
          title="Open in new tab"
          onClick={onOpenInNewHandler}>
          <OpenInNewIcon size={16} />
        </button>
        <button
          className="bookmark__button bookmark__button_delete"
          title="Delete"
          onClick={onRemoveHandler}>
          <DeleteIcon size={16} />
        </button>
      </div>
    </li>
  );
};

export default SortableElement(BookmarkItem);
