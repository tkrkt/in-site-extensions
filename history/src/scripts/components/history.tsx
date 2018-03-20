import * as React from 'react';
import {bind} from 'decko';
import * as OpenInNewIcon from 'react-icons/lib/md/open-in-new';
import * as DeleteIcon from 'react-icons/lib/md/delete';
import * as moment from 'moment';

import {History} from '../reducers';

interface Props {
  history: History;
  isCurrent?: boolean;
  onSelect: (arg: {history: History, openInNew: boolean}) => void;
  onRemove: (arg: {history: History}) => void;
}

const HistoryItem = ({
  history,
  isCurrent,
  onSelect,
  onRemove
}: Props) => {
  const onSelectHandler = (e: any) => {
    if (e.button !== 1) {
      onSelect({history, openInNew: false});
    }
  };
  const onMiddleClickHandler = (e: any) => {
    if (e.button === 1) {
      onSelect({history, openInNew: true});
    }
  };
  const onRemoveHandler = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onRemove({history});
  };
  const onOpenInNewHandler = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onSelect({history, openInNew: true});
  };

  const path = (window as any).decodeURIComponent(history.path);
  const url = (window as any).decodeURIComponent(history.url);

  return (
    <li
      className={isCurrent ? 'history history_current' : 'history'}
      onClick={onSelectHandler}
      onMouseUp={onMiddleClickHandler}>
      <div className="history__title">{history.title || 'No title'}</div>
      <div className="history__description">
        <div className="history__path" title={url}>{path}</div>
        <div className="history__time">{moment(history.lastVisitTime).fromNow()}</div>
      </div>
      <div className="history__control">
        <button
          className="history__button history__button_open-in-new"
          title="Open in new tab"
          onClick={onOpenInNewHandler}>
          <OpenInNewIcon size={16} />
        </button>
        <button
          className="history__button history__button_delete"
          title="Delete"
          onClick={onRemoveHandler}>
          <DeleteIcon size={16} />
        </button>
      </div>
    </li>
  );
};

export default HistoryItem;
