import * as React from "react";
import { MdDelete as DeleteIcon } from "react-icons/md";
import { Page } from "../reducers";
import Favicon from "./favicon";

interface Props {
  page: Page;
  isValidUrl: boolean;
  onRemoveAll: () => void;
}

const AppBarItem = ({ page, isValidUrl, onRemoveAll }: Props) => {
  let button: React.ReactNode;

  if (isValidUrl) {
    button = (
      <button
        className="header__button header__button--removeall"
        title="Delete all histories in this site"
        onClick={onRemoveAll}
      >
        <span className={"header__buttonitem"}>
          <DeleteIcon className={"header__icon"} size={28} />
        </span>
        <span className={"header__buttonitem header__buttonitem--cover"}>
          <DeleteIcon className={"header__icon"} size={28} />
        </span>
      </button>
    );
  }

  let hostname: string;
  if (page.result && isValidUrl) {
    hostname = (window as any).decodeURIComponent(page.result.host);
  } else {
    hostname = "In-Site History";
  }

  return (
    <header className={"header"}>
      {page.result && (
        <Favicon className={"header__favicon"} url={page.result.favicon} />
      )}
      <span className="hostname">{hostname}</span>
      {button}
    </header>
  );
};

export default AppBarItem;
