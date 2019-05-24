import "./styles/popup.scss";
import * as React from "react";
import { Store } from "webext-redux";
import { render } from "react-dom";
import { Provider } from "react-redux";
import PopupContainer from "./containers/popup";
import { popupLoaded } from "./actions";

const proxyStore = new Store({
  portName: "in-site-bookmark"
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
    proxyStore.dispatch(popupLoaded());
  })
  .catch(console.error);
