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
        className="button-removeall"
        title="Delete all history in this site"
        onClick={onRemoveAll}>
        <DeleteIcon size={28} color="#00BCD4" />
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
