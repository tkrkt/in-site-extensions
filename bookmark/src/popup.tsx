import "./styles/popup.scss";
import * as React from "react";
import { Store } from "react-chrome-redux";
import { render } from "react-dom";
import { Provider } from "react-redux";
import PopupContainer from "./containers/popup";

const extension: string = "/* @echo extension */";
const proxyStore = new Store({
  portName: "in-site-bookmark",
  extensionId: extension === "firefox" ? "in-site-bookmark@tkrkt.com" : ""
});

proxyStore
  .ready()
  .then(() => {
    render(
      <Provider store={proxyStore as any}>
        <PopupContainer />
      </Provider>,
      document.getElementById("app")
    );
  })
  .then(async () => {
    if (extension === "chrome") {
      // dirty hack to fix drawings of popup window
      const appElement = document.getElementById("app");
      if (appElement) {
        for (let i = 0; i < 3; i++) {
          const height = appElement.getBoundingClientRect().height;
          document.body.style.height = `${height + 1}px`;
          await new Promise(r => setTimeout(r, 100));
        }
        document.body.style.height = "";
        if (appElement.getBoundingClientRect().height > 600) {
          appElement.style.height = "600px";
          appElement.style.overflowY = "hidden";
          await new Promise(r => setTimeout(r, 100));
          appElement.style.height = "";
          appElement.style.overflowY = "";
        }
      }
    }
  })
  .catch(console.error);
