import * as React from "react";
import { MdAddCircle as AddIcon, MdDone as DoneIcon } from "react-icons/md";
import { Page } from "../reducers";
import Favicon from "./favicon";

interface Props {
  page: Page;
  isAlreadyAdded?: boolean;
  isValidUrl: boolean;
  onAdd: () => void;
}

const AppBar = ({ page, isValidUrl, isAlreadyAdded, onAdd }: Props) => {
  let button;

  if (isValidUrl) {
    if (isAlreadyAdded) {
      button = React.useMemo(
        () => (
          <button
            className="header__button header__button--added"
            title="Already added"
          >
            <DoneIcon size={28} color="white" />
          </button>
        ),
        [isValidUrl, isAlreadyAdded]
      );
    } else {
      button = React.useMemo(
        () => (
          <button
            className="header__button header__button--add"
            title="Add current page to bookmark"
            onClick={onAdd}
          >
            <AddIcon size={28} color="white" />
          </button>
        ),
        [isValidUrl, isAlreadyAdded]
      );
    }
  }

  let hostname;
  if (page.result && isValidUrl) {
    hostname = (window as any).decodeURIComponent(page.result.host.url);
  } else {
    hostname = "In-Site Bookmark";
  }

  return (
    <header className={"header"}>
      {page.result && (
        <Favicon className={"header__favicon"} url={page.result.host.favicon} />
      )}
      <span className="hostname">{hostname}</span>
      {button}
    </header>
  );
};

export default AppBar;
