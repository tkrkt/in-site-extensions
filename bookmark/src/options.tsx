import "./styles/options.scss";
import * as React from "react";
import { Store } from "react-chrome-redux";
import { render } from "react-dom";
import { Provider } from "react-redux";
import OptionContainer from "./containers/option";

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
        <OptionContainer />
      </Provider>,
      document.getElementById("app")
    );
  })
  .catch(console.error);
