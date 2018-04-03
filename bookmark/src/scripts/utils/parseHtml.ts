import {Hosts, Bookmark} from '../reducers';
import {isValid, getHostName, getPath} from './url';

const parseA = (a: string) => {
  const href: string = (a.match(/(href|HREF)="([^"]+)"/) || [])[2];
  const title = (a.match(/>(.+)</) || [])[1];
  const favicon: string = (a.match(/(icon_uri|ICON_URI)="([^"]+)"/) || [])[2] || '';
  return {href, title, favicon};
};

const parseHtml = (html): Hosts => {
  const hosts: Hosts = {};
  const group = html.match(/<[aA][^<]+<\/[aA]>/g);
  if (group.length) {
    group.forEach((aTag) => {
      const a = parseA(aTag);
      if (a.href && isValid(a.href)) {
        const hostname = getHostName(a.href);
        if (!hosts[hostname]) {
          hosts[hostname] = {
            url: hostname,
            favicon: a.favicon,
            bookmarks: []
          };
        }
        hosts[hostname].bookmarks.push({
          title: a.title,
          url: a.href,
          path: getPath(a.href)
        });
      }
    });
  }
  return hosts;
};

export default parseHtml;
