import { Bookmark, Host, Hosts } from "../reducers";

const header = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>In-Site Bookmark</TITLE>
<H1>Bookmarks</H1>

<DL><p>
`;

const footer = `
</DL><p>
`;

const createA = (bookmark: Bookmark, favicon: string): string => {
  return `<DT><A HREF="${bookmark.url}" ICON_URI="${favicon}">${
    bookmark.title
  }</A>`;
};

const createDir = (host: Host): string => {
  return `<DT><H3>${host.url}</H3>
<DL><p>
  ${host.bookmarks.map(b => createA(b, host.favicon)).join("\n  ")}
</DL><p>`;
};

const generateHtml = (hosts: Hosts) => {
  const hostsHtml = Object.keys(hosts)
    .map(key => createDir(hosts[key]))
    .join("\n");
  return header + hostsHtml + footer;
};

export default generateHtml;
