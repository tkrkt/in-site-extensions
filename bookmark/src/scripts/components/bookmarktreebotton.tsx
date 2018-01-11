import * as React from 'react';
import * as DeleteIcon from 'react-icons/lib/md/delete';

interface Props {
  onClick: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
}

const BookmarkTreeButton = ({onClick}: Props) => {
  return (
    <button
      className="bookmark-tree-button"
      title="Delete"
      onClick={onClick}>
      <DeleteIcon size={16} />
    </button>
  );
};

export default BookmarkTreeButton;
