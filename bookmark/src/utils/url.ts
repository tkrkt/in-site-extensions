export const getHostName = (url?: string | URL): string => {
  if (!url) {
    return "";
  } else if (typeof url === "string") {
    url = new URL(url);
  }
  return url.hostname;
};

const domainExtractor = /([a-z\-0-9]{2,63}\.[a-z\.]{2,5})$/;
export const getDomainName = (host: string) => {
  const match = domainExtractor.exec(host);
  if (match) {
    return match[1];
  } else {
    return "";
  }
};

export const getPath = (url?: string | URL): string => {
  if (!url) {
    return "";
  } else if (typeof url === "string") {
    url = new URL(url);
  }
  return url.pathname + url.search + url.hash;
};

export const isValid = (url: string | undefined): boolean => {
  return !!url && /^http/.test(url);
};
