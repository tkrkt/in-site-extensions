import { useCallback, useEffect, useState } from "react";
import { getHostName, isValid } from "./url";
import Header from "./Header";
import ListItem from "./ListItem";
import Search from "./Search";
import {
  History,
  Histories,
  getHistory,
  removeAllHistories,
  removeHistory,
  getMoreHistory,
} from "./history";
import Loading from "./Loading";

function App() {
  const [pageState, setPageState] = useState<{
    host: string;
    faviconUrl: string;
    url: string;
  }>();
  const [histories, setHistories] = useState<Histories>();
  const [query, setQuery] = useState("");

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length) {
        const host = getHostName(tabs[0].url);
        setPageState({
          host,
          faviconUrl: tabs[0].favIconUrl || "",
          url: tabs[0].url || "",
        });
        if (isValid(tabs[0].url)) {
          getHistory(host).then(setHistories);
        } else {
          setHistories({
            host,
            endTime: +new Date(),
            paths: {},
            items: [],
            completed: true,
          });
        }
      }
    });
  }, []);

  const handleDeleteAll = useCallback(() => {
    if (histories) {
      removeAllHistories(histories);
      setHistories({
        ...histories,
        items: [],
      });
    }
  }, [histories]);

  const handleDelete = useCallback(
    (history: History) => {
      if (histories) {
        removeHistory(history);
        setHistories({
          ...histories,
          items: histories.items.filter((item) => item.url !== history.url),
        });
      }
    },
    [histories]
  );

  const handleLoadMore = useCallback(() => {
    if (histories) {
      getMoreHistory(histories).then(setHistories);
    }
  }, [histories]);

  if (!pageState || !histories) {
    return null;
  }

  const items = histories.items.filter((item) => {
    const queries = query.trim().split(" ");
    return queries.every(
      (query) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.url.toLowerCase().includes(query.toLowerCase())
    );
  });

  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      <Header
        faviconUrl={pageState.faviconUrl}
        hostUrl={pageState.host}
        onDeleteAll={handleDeleteAll}
        isValid={isValid(pageState.url)}
      />
      <Search query={query} onQueryChange={setQuery} />
      <div
        style={{
          width: "100%",
          overflowX: "hidden",
        }}
      >
        {items.map((item) => (
          <ListItem
            key={item.url}
            history={item}
            isCurrent={item.url === pageState.url}
            onDelete={handleDelete}
          />
        ))}
        {items.length === 0 && (
          <div
            style={{
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {histories.items.length
              ? "No results."
              : "No histories on this site."}
          </div>
        )}
        {!histories.completed && !query && (
          <Loading onVisible={handleLoadMore} />
        )}
      </div>
    </div>
  );
}

export default App;
