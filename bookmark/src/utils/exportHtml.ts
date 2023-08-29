import { Bookmark } from "./url";

const createHeader = () => `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>In-Site Bookmark ${new Date().toLocaleString()}</TITLE>
<H1>Bookmarks</H1>

<DL><p>
`;

const footer = `
</DL><p>
`;

const createA = (bookmark: Bookmark): string => {
  return `<DT><A HREF="${bookmark.url}">${bookmark.title}</A>`;
};

const createDir = (hostUrl: string, bookmarks: Bookmark[]): string => {
  return `<DT><H3>${hostUrl}</H3>
<DL><p>
  ${bookmarks.map(createA).join("\n  ")}
</DL><p>`;
};

const generateHtml = (bookmarks: { [host: string]: Bookmark[] }) => {
  const hostsHtml = Object.entries(bookmarks)
    .filter(([, bookmarks]) => bookmarks.length > 0)
    .map(([host, bookmarks]) => createDir(host, bookmarks))
    .join("\n");
  return createHeader() + hostsHtml + footer;
};

export const exportHtml = (
  bookmarks: {
    [host: string]: Bookmark[];
  },
  filename: string
) => {
  const html = generateHtml(bookmarks);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download({
    url,
    filename,
  });
};
