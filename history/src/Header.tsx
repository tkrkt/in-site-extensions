import deleteIcon from "./images/delete_white.svg";

function Header({
  faviconUrl,
  hostUrl,
  isValid,
  onDeleteAll,
}: {
  faviconUrl: string;
  hostUrl: string;
  isValid: boolean;
  onDeleteAll: () => void;
}) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        gap: "12px",
        height: "36px",
        paddingLeft: "12px",
        paddingRight: "8px",
        backgroundColor: "var(--color-primary)",
        boxSizing: "border-box",
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
            title="Delete all histories"
            onClick={onDeleteAll}
          >
            <img src={deleteIcon} />
          </div>
        </>
      )}
    </header>
  );
}

export default Header;
