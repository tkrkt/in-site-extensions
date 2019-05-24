export const getHostName = (url?: string | URL): string => {
  if (!url) {
    return "";
  } else if (typeof url === "string") {
    url = new URL(url);
  }
  return url.hostname;
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
