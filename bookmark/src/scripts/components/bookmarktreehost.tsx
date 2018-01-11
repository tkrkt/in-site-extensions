import * as React from 'react';
import {bind} from 'decko';
import * as CollapsedIcon from 'react-icons/lib/md/keyboard-arrow-right';
import * as ExpandedIcon from 'react-icons/lib/md/keyboard-arrow-down';

import Favicon from './favicon';
import BookmarkTreeButton from './bookmarktreebotton';
import {Host, Bookmark} from '../reducers';

import BookmarkTreePage from './bookmarktreepage';

interface Props {
  className: string;
  host: Host;
  onRemoveHost: (arg: {host: Host}) => void;
  onRemoveBookmark: (arg: {host: Host, bookmark: Bookmark}) => void;
}

interface State {
  expanded: boolean;
  hover: boolean;
}

class BookmarkTreeHost extends React.Component<Props, State> {
  state = {
    expanded: false,
    hover: false
  };

  @bind
  toggleExpand() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  @bind
  onMouseEnter() {
    this.setState({
      hover: true
    });
  }

  @bind
  onMouseLeave() {
    this.setState({
      hover: false
    });
  }

  @bind
  onRemoveHost(event: React.SyntheticEvent<HTMLButtonElement>) {
    event.stopPropagation();
    this.props.onRemoveHost({host: this.props.host});
  }

  @bind
  onRemoveBookmark(bookmark: Bookmark) {
    this.props.onRemoveBookmark({host: this.props.host, bookmark});
  }

  render() {
    const {host, className} = this.props;
    const {expanded, hover} = this.state;

    let folderIcon;
    let bookmarkNodes;
    if (expanded) {
      folderIcon = (
        <ExpandedIcon size={16} />
      );
      bookmarkNodes = host.bookmarks.map((bookmark) => (
        <BookmarkTreePage
          key={`bookmark-tree-page-${host.url}-${bookmark.url}`}
          className={className}
          bookmark={bookmark}
          onRemove={this.onRemoveBookmark}
          hover={hover} />
      ));
    } else {
      folderIcon = (
        <CollapsedIcon size={16} />
      );
      bookmarkNodes = [];
    }

    return [(
      <li
        key={'bookmark-tree-host-' + host.url}
        className={`${className} ${hover ? className + '_hover' : ''} bookmark-tree-host`}
        onClick={this.toggleExpand}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}>
        {folderIcon}
        <Favicon className="bookmark-tree-host__favicon" url={host.favicon}/>
        <span>{(window as any).decodeURIComponent(host.url)}</span>
        <BookmarkTreeButton onClick={this.onRemoveHost} />
      </li>
    ), ...bookmarkNodes];
  }
}

export default BookmarkTreeHost;
