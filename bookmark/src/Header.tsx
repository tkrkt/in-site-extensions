import addIcon from "./images/add.svg";
import checkIcon from "./images/check.svg";
import randomIcon from "./images/random.svg";
import moreIcon from "./images/more.svg";
import { useState } from "react";

function Header({
  faviconUrl,
  hostUrl,
  isValid,
  isAlreadyAdded,
  onAdd,
  onRandom,
  onOpenAll,
  onImport,
  onExportAll,
  onExportCurrentDomain,
}: {
  faviconUrl: string;
  hostUrl: string;
  isValid: boolean;
  isAlreadyAdded: boolean;
  onAdd: () => void;
  onRandom: () => void;
  onOpenAll: () => void;
  onImport: () => void;
  onExportAll: () => void;
  onExportCurrentDomain: () => void;
}) {
  const [showMore, setShowMore] = useState(false);

  return (
    <header
      style={{
        width: "100%",
        paddingLeft: "12px",
        paddingRight: "8px",
        backgroundColor: "var(--color-primary)",
        boxSizing: "border-box",
        height: showMore ? 36 * 2 : 36,
        transitionProperty: "height",
        transitionDuration: "0.1s",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          gap: "12px",
          height: "36px",
        }}
      >
        <div
          style={{
            height: "20px",
            width: "20px",
            border: "1px solid rgba(255, 255, 255, 0.5)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={faviconUrl}
            style={{
              height: "16px",
              width: "16px",
            }}
          />
        </div>
        <div
          style={{
            flexGrow: 2,
            fontSize: "16px",
            color: "white",
          }}
        >
          {hostUrl}
        </div>
        {isValid && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              title="More"
              onClick={() => setShowMore(!showMore)}
            >
              <img src={moreIcon} />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              title="Randomly open a bookmark"
              onClick={onRandom}
            >
              <img src={randomIcon} />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: isAlreadyAdded ? "auto" : "pointer",
              }}
              title={
                isAlreadyAdded ? "Already bookmarked" : "Bookmark this page"
              }
              onClick={() => !isAlreadyAdded && onAdd()}
            >
              <img src={isAlreadyAdded ? checkIcon : addIcon} />
            </div>
          </>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          gap: "12px",
          height: "36px",
        }}
      >
        <button type="button" onClick={onOpenAll}>
          Open all
        </button>
        <button type="button" onClick={onImport}>
          Import
        </button>
        <button type="button" onClick={onExportCurrentDomain}>
          Export for this domain
        </button>
        <button type="button" onClick={onExportAll}>
          Export all
        </button>
      </div>
    </header>
  );
}

export default Header;
