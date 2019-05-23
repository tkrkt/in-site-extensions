import * as React from "react";
import { Bookmark, Host, Page, Hosts } from "../reducers";
import BookmarkListSection from "./bookmarkListSection";

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
  includesSubdomain: boolean;
  subdomainHosts: Hosts;
  query: string;
}

const BookmarkList = (props: Props) => {
  const { host, onSortEnd, includesSubdomain, subdomainHosts } = props;

  let subdomainLists;
  if (includesSubdomain) {
    subdomainLists = Object.keys(subdomainHosts)
      .sort()
      .map(key => {
        const subdomainHost = subdomainHosts[key];
        return (
          <BookmarkListSection
            key={`section-${subdomainHost.url}`}
            {...props}
            host={subdomainHost}
            isSubdomain={true}
            onSortEnd={onSortEnd}
          />
        );
      });
  }

  return (
    <>
      <BookmarkListSection
        {...props}
        host={host}
        isSubdomain={false}
        onSortEnd={onSortEnd}
      />
      {subdomainLists}
    </>
  );
};

export default BookmarkList;
