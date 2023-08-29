import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Bookmark } from "./utils/url";
import starIcon from "./images/star.svg";
import openInNewIcon from "./images/open_in_new.svg";
import deleteIcon from "./images/delete.svg";
import editIcon from "./images/edit.svg";
import "./ListItem.css";
import { MouseEvent } from "react";

function ListItem({
  bookmark,
  isCurrent,
  onDelete,
  onEdit,
}: {
  bookmark: Bookmark;
  isCurrent: boolean;
  onDelete: (bookmark: Bookmark) => void;
  onEdit: (bookmark: Bookmark) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: bookmark.url });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const handleListClick = (e: MouseEvent) => {
    if (e.button === 1) {
      chrome.tabs.create({ url: bookmark.url }, window.close);
    } else {
      chrome.tabs.update({ url: bookmark.url }, window.close);
    }
  };

  const handleEditClick = (e: MouseEvent) => {
    e.stopPropagation();
    const newTitle = window.prompt("Edit title", bookmark.title);

    if (newTitle) {
      onEdit({
        ...bookmark,
        title: newTitle,
      });
    }
  };

  const handleOpenInNewTabClick = (e: MouseEvent) => {
    e.stopPropagation();
    chrome.tabs.create({ url: bookmark.url }, window.close);
  };

  const handleDeleteClick = (e: MouseEvent) => {
    e.stopPropagation();
    onDelete(bookmark);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="ListItem-root"
      onClick={handleListClick}
    >
      <div
        className="ListItem-title"
        style={{
          display: "flex",
          alignItems: "center",
          color: isCurrent ? "var(--color-primary-text)" : "black",
        }}
      >
        {bookmark.isBrowserBookmark && (
          <img
            src={starIcon}
            style={{
              height: "18px",
            }}
            title={"Browser bookmark"}
          />
        )}
        {bookmark.title}
      </div>
      <div className="ListItem-url">{bookmark.path}</div>
      <div className="ListItem-controls">
        <div
          className="ListItem-control ListItem-control-open"
          title="Open in new tab"
          onClick={handleOpenInNewTabClick}
        >
          <img src={openInNewIcon} />
        </div>
        {!bookmark.isBrowserBookmark && (
          <>
            <div
              className="ListItem-control ListItem-control-edit"
              title="Edit title"
              onClick={handleEditClick}
            >
              <img src={editIcon} />
            </div>
            <div
              className="ListItem-control ListItem-control-delete"
              title="Delete"
              onClick={handleDeleteClick}
            >
              <img src={deleteIcon} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ListItem;
