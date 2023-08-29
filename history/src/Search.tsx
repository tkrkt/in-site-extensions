import searchIcon from "./images/search.svg";
import clearIcon from "./images/clear.svg";

function Search({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (query: string) => void;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "28px",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#eee",
      }}
    >
      <img
        src={searchIcon}
        style={{
          width: "20px",
          flexShrink: 0,
          paddingInline: "4px",
        }}
      />
      <input
        type="text"
        placeholder="Find..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        style={{
          width: "100%",
          fontSize: "14px",
          border: "none",
          height: "24px",
          boxSizing: "border-box",
          backgroundColor: "transparent",
          outline: "none",
          flexGrow: 2,
        }}
      />
      <img
        src={clearIcon}
        style={{
          width: "20px",
          flexShrink: 0,
          paddingInline: "4px",
          cursor: "pointer",
        }}
        onClick={() => onQueryChange("")}
      />
    </div>
  );
}

export default Search;
