import * as React from "react";
import { connect } from "react-redux";
import {
  exportHosts,
  importHosts,
  removeBookmark,
  removeHost
} from "../actions";
import BookmarkTree from "../components/bookmarktree";
import { Hosts, Store } from "../reducers";
import parseHtml from "../utils/parseHtml";

interface StateProps {
  hosts: Hosts;
}

interface DispatchProps {
  removeBookmark: typeof removeBookmark;
  removeHost: typeof removeHost;
  importHosts: typeof importHosts;
  exportHosts: typeof exportHosts;
}

const loadTextFile = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    Object.assign(input.style, {
      visibility: "hidden",
      width: 0,
      height: 0,
      overflow: "hidden",
      position: "absolute"
    });
    const handler = () => {
      input.removeEventListener("change", handler);
      document.body.removeChild(input);
      if (input.value && input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            resolve(reader.result.toString());
          }
        };
        reader.readAsText(input.files[0]);
      }
    };
    document.body.appendChild(input);
    input.addEventListener("change", handler);
    input.click();
  });
};

const OptionContainer = (props: StateProps & DispatchProps) => {
  // tslint:disable:no-shadowed-variable
  const { hosts, removeHost, removeBookmark, importHosts, exportHosts } = props;
  const importHtml = () => {
    loadTextFile().then(text => {
      importHosts({ hosts: parseHtml(text) });
    });
  };
  const exportHtml = () => exportHosts();

  return (
    <div className="option">
      <p>Stored bookmarks:</p>
      <BookmarkTree
        hosts={hosts}
        onRemoveHost={removeHost}
        onRemoveBookmark={removeBookmark}
      />
      <div className="option__controls">
        <button
          onClick={exportHtml}
          className="option__button option__button--export"
        >
          Export bookmarks
        </button>
        <button
          onClick={importHtml}
          className="option__button option__button--import"
        >
          Import bookmarks
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: Store): StateProps => ({
  hosts: state.hosts
});

const mapDispatchToProps: DispatchProps = {
  removeBookmark,
  removeHost,
  importHosts,
  exportHosts
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OptionContainer);
