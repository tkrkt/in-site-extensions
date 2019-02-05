import * as React from "react";
import { Bookmark } from "../reducers";
import BookmarkTreeButton from "./bookmarktreebotton";

interface Props {
  className: string;
  bookmark: Bookmark;
  hover: boolean;
  onRemove: (bookmark: Bookmark) => void;
}

const BookmarkTreePage = ({ className, bookmark, hover, onRemove }: Props) => {
  const path = (window as any).decodeURIComponent(bookmark.path);
  const url = (window as any).decodeURIComponent(bookmark.url);
  const onRemoveHandler = React.useCallback(() => onRemove(bookmark), [
    onRemove,
    bookmark
  ]);
  return (
    <li
      className={`${className} ${
        hover ? className + "_hover" : ""
      } bookmark-tree-page`}
    >
      <div className="bookmark-tree-page__title">{bookmark.title}</div>
      <div className="bookmark-tree-page__path" title={url}>
        {path}
      </div>
      <BookmarkTreeButton onClick={onRemoveHandler} />
    </li>
  );
};

export default BookmarkTreePage;
