import * as React from 'react';
import * as AddIcon from 'react-icons/lib/md/add-circle';
import * as DoneIcon from 'react-icons/lib/md/done';
import {Page} from '../reducers';
import Favicon from './favicon';

interface Props {
  page: Page;
  isAlreadyAdded?: boolean;
  isValidUrl: boolean;
  onAdd: () => void;
}

const AppBarItem = ({
  page,
  isValidUrl,
  isAlreadyAdded,
  onAdd
}: Props) => {
  let button;

  if (isValidUrl) {
    if (isAlreadyAdded) {
      button = (
        <button
          className="button-add"
          title="Already added">
          <DoneIcon size={28} color="#00BCD4" />
        </button>
      );
    } else {
      button = (
        <button
          className="button-add"
          title="Add current page to bookmark"
          onClick={onAdd}>
          <AddIcon size={28} color="#00BCD4" />
        </button>
      );
    }
  }

  let hostname;
  if (page.result && isValidUrl) {
    hostname = (window as any).decodeURIComponent(page.result.host.url);
  } else {
    hostname = 'In-Site Bookmark';
  }

  return (
    <header className={'header'}>
      {page.result && <Favicon className={'header__favicon'} url={page.result.host.favicon} />}
      <span className="hostname">{hostname}</span>
      {button}
    </header>
  );
};

export default AppBarItem;
