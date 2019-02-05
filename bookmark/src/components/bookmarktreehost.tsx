import * as React from "react";
import {
  MdKeyboardArrowDown as ExpandedIcon,
  MdKeyboardArrowRight as CollapsedIcon
} from "react-icons/md";
import { Bookmark, Host } from "../reducers";
import BookmarkTreeButton from "./bookmarktreebotton";
import Favicon from "./favicon";

import BookmarkTreePage from "./bookmarktreepage";

interface Props {
  className: string;
  host: Host;
  onRemoveHost: (arg: { host: Host }) => void;
  onRemoveBookmark: (arg: { host: Host; bookmark: Bookmark }) => void;
}

const BookmarkTreeHost = ({
  host,
  className,
  onRemoveHost,
  onRemoveBookmark
}: Props) => {
  const [expanded, setExpanded] = React.useState(false);
  const [hover, setHover] = React.useState(false);

  const toggleExpand = React.useCallback(() => setExpanded(ex => !ex), []);
  const handleMouseEnter = React.useCallback(() => setHover(true), []);
  const handleMouseLeave = React.useCallback(() => setHover(false), []);
  const handleRemoveHost = React.useCallback(
    (event: React.SyntheticEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onRemoveHost({ host });
    },
    [onRemoveHost, host]
  );
  const handleRemoveBookmark = React.useCallback(
    (bookmark: Bookmark) => {
      onRemoveBookmark({ host, bookmark });
    },
    [onRemoveBookmark, host]
  );

  let folderIcon: React.ReactNode;
  let bookmarkNodes: React.ReactNode[];
  if (expanded) {
    folderIcon = <ExpandedIcon size={16} />;
    bookmarkNodes = host.bookmarks.map(bookmark => (
      <BookmarkTreePage
        key={`bookmark-tree-page-${host.url}-${bookmark.url}`}
        className={className}
        bookmark={bookmark}
        onRemove={handleRemoveBookmark}
        hover={hover}
      />
    ));
  } else {
    folderIcon = <CollapsedIcon size={16} />;
    bookmarkNodes = [];
  }

  return (
    <>
      <li
        key={"bookmark-tree-host-" + host.url}
        className={`${className} ${
          hover ? className + "_hover" : ""
        } bookmark-tree-host`}
        onClick={toggleExpand}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {folderIcon}
        <Favicon className="bookmark-tree-host__favicon" url={host.favicon} />
        <span>{(window as any).decodeURIComponent(host.url)}</span>
        <BookmarkTreeButton onClick={handleRemoveHost} />
      </li>
      {bookmarkNodes}
    </>
  );
};

export default BookmarkTreeHost;
