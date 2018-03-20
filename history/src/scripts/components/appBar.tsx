import * as React from 'react';
import * as DeleteIcon from 'react-icons/lib/md/delete';
import {Page} from '../reducers';
import Favicon from './favicon';

interface Props {
  page: Page;
  isValidUrl: boolean;
  onRemoveAll: () => void;
}

const AppBarItem = ({
  page,
  isValidUrl,
  onRemoveAll
}: Props) => {
  let button;

  if (isValidUrl) {
    button = (
      <button
        className="header__button header__button--removeall"
        title="Delete all histories in this site"
        onClick={onRemoveAll}>
        <span className={'header__buttonitem'}>
          <DeleteIcon size={28} color={'#f44336'} />
        </span>
        <span className={'header__buttonitem header__buttonitem--cover'}>
          <DeleteIcon size={28} color={'#6CBC13'} />
        </span>
      </button>
    );
  }

  let hostname;
  if (page.result && isValidUrl) {
    hostname = (window as any).decodeURIComponent(page.result.host);
  } else {
    hostname = 'In-Site History';
  }

  return (
    <header className={'header'}>
      {page.result && <Favicon className={'header__favicon'} url={page.result.favicon} />}
      <span className="hostname">{hostname}</span>
      {button}
    </header>
  );
};

export default AppBarItem;
