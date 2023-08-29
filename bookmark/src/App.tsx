import { useCallback, useEffect, useState } from "react";
import { Bookmark, PageState, getPageStateFromTab, isValid } from "./utils/url";
import {
  getVersion,
  importBookmarks,
  loadAllBookmarks,
  loadBookmarks,
  saveBookmarks,
} from "./utils/storage";
import Header from "./Header";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ListItem from "./ListItem";
import Search from "./Search";
import { exportHtml } from "./utils/exportHtml";
import { loadTextFile } from "./utils/loadTextFile";
import parseHtml from "./utils/parseHtml";

function App() {
  const [currentPageState, setCurrentPageState] = useState<PageState>();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getVersion().then(console.log);
  }, []);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length) {
        const pageState = getPageStateFromTab(tabs[0]);
        setCurrentPageState(pageState);
        loadBookmarks(pageState.host.url).then(setBookmarks);
      }
    });
  }, []);

  const handleAdd = useCallback(() => {
    if (!currentPageState) {
      return;
    }
    const newBookmarks = [...bookmarks, currentPageState.bookmark];
    setBookmarks(newBookmarks);
    saveBookmarks(currentPageState.host.url, newBookmarks);
  }, [currentPageState, bookmarks]);

  const handleRandom = useCallback(() => {
    if (bookmarks.length) {
      const randomBookmark =
        bookmarks[Math.floor(Math.random() * bookmarks.length)];
      chrome.tabs.update({ url: randomBookmark.url }, window.close);
    }
  }, [bookmarks]);

  const handleOpenAll = useCallback(() => {
    if (bookmarks.length) {
      bookmarks.forEach((bookmark) => {
        chrome.tabs.create({ url: bookmark.url });
      });
      window.close();
    }
  }, [bookmarks]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id && currentPageState) {
        setBookmarks((bookmarks) => {
          const oldIndex = bookmarks.findIndex(
            (bookmark) => bookmark.url === active.id
          );
          const newIndex = bookmarks.findIndex(
            (bookmark) => bookmark.url === over.id
          );
          const newBookmarks = arrayMove(bookmarks, oldIndex, newIndex);
          saveBookmarks(currentPageState.host.url, newBookmarks);
          return newBookmarks;
        });
      }
    },
    [currentPageState]
  );

  const handleEdit = useCallback(
    (bookmark: Bookmark) => {
      if (currentPageState) {
        setBookmarks((bookmarks) => {
          const newBookmarks = bookmarks.map((b) =>
            b.url === bookmark.url ? bookmark : b
          );
          saveBookmarks(currentPageState.host.url, newBookmarks);
          return newBookmarks;
        });
      }
    },
    [currentPageState]
  );

  const handleDelete = useCallback(
    (bookmark: Bookmark) => {
      if (currentPageState) {
        setBookmarks((bookmarks) => {
          const newBookmarks = bookmarks.filter((b) => b.url !== bookmark.url);
          saveBookmarks(currentPageState.host.url, newBookmarks);
          return newBookmarks;
        });
      }
    },
    [currentPageState]
  );

  const handleImport = useCallback(async () => {
    if (currentPageState) {
      const text = await loadTextFile();
      const bookmarks = await parseHtml(text);

      await importBookmarks(bookmarks);

      loadBookmarks(currentPageState.host.url).then(setBookmarks);
    }
  }, [currentPageState]);

  const handleExportAll = useCallback(async () => {
    const allBookmarks = await loadAllBookmarks();
    exportHtml(allBookmarks, "bookmarks-all.html");
  }, []);

  const handleExportCurrentDomain = useCallback(() => {
    if (currentPageState) {
      exportHtml(
        {
          [currentPageState.host.url]: bookmarks,
        },
        `bookmarks-${currentPageState.host.url}.html`
      );
    }
  }, [currentPageState, bookmarks]);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  if (!currentPageState) {
    return null;
  }

  const isAlreadyAdded = bookmarks.some(
    (bookmark) => bookmark.url === currentPageState.bookmark.url
  );

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const queries = query.trim().split(" ");
    return queries.every(
      (query) =>
        bookmark.title.toLowerCase().includes(query.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(query.toLowerCase())
    );
  });

  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      <Header
        faviconUrl={currentPageState.host.favicon}
        hostUrl={currentPageState.host.url}
        isAlreadyAdded={isAlreadyAdded}
        isValid={isValid(currentPageState.bookmark.url)}
        onAdd={handleAdd}
        onRandom={handleRandom}
        onOpenAll={handleOpenAll}
        onImport={handleImport}
        onExportAll={handleExportAll}
        onExportCurrentDomain={handleExportCurrentDomain}
      />
      <Search query={query} onQueryChange={setQuery} />
      <div
        style={{
          width: "100%",
          overflowX: "hidden",
        }}
      >
        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
          <SortableContext
            items={filteredBookmarks.map((b) => ({ ...b, id: b.url }))}
            strategy={verticalListSortingStrategy}
          >
            {filteredBookmarks.map((bookmark) => (
              <ListItem
                key={bookmark.url}
                bookmark={bookmark}
                isCurrent={bookmark.url === currentPageState.bookmark.url}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
            {filteredBookmarks.length === 0 && (
              <div
                style={{
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {bookmarks.length
                  ? "No results."
                  : "No bookmarks on this site."}
              </div>
            )}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

export default App;
