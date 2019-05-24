import * as React from "react";

interface Props {
  className?: string;
  url: string;
}

const Favicon = ({ url, className }: Props) => {
  const [error, setError] = React.useState(false);
  const handleError = React.useCallback(() => setError(true), [setError]);

  if (url && !error) {
    return <img src={url} className={className} onError={handleError} />;
  } else {
    return null;
  }
};

export default Favicon;
