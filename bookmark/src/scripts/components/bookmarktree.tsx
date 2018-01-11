import * as React from 'react';
import Favicon from './favicon';
import {Hosts, Host, Bookmark} from '../reducers';

import BookmarkTreeHost from './bookmarktreehost';

interface Props {
  hosts: Hosts;
  onRemoveHost: (arg: {host: Host}) => void;
  onRemoveBookmark: (arg: {host: Host, bookmark: Bookmark}) => void;
}

const BookmarkTree = ({hosts, onRemoveHost, onRemoveBookmark}: Props) => {
  const hostNodes = Object.keys(hosts).map((key) => (
    <BookmarkTreeHost
      key={'bookmark-tree-' + hosts[key].url}
      className="bookmark-tree__item"
      host={hosts[key]}
      onRemoveHost={onRemoveHost}
      onRemoveBookmark={onRemoveBookmark} />
  ));

  return (
    <ul className="bookmark-tree">
      {hostNodes}
    </ul>
  );
};

export default BookmarkTree;
