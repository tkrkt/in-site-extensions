import "./styles/popup.scss";
import throttle from "lodash.throttle";
import * as React from "react";
import { render } from "react-dom";
import { Store } from "webext-redux";
import { Provider } from "react-redux";
import { loadHistory, scrolledToBottom, popupLoaded } from "./actions";

import PopupContainer from "./containers/popup";

const proxyStore = new Store({
  portName: "in-site-history"
});

const scrollThrottleDuration = 500;
const scrollBottomThreshold = 10;

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
  .then(() => {
    proxyStore.dispatch(loadHistory({}));
  })
  .then(() => {
    // watch scroll for infini scroll
    window.addEventListener(
      "scroll",
      throttle(() => {
        const current = window.innerHeight + window.scrollY;
        const de = document.documentElement;
        const bottom = Math.max(
          de.scrollHeight,
          de.offsetHeight,
          de.clientHeight
        );
        if (bottom - current < scrollBottomThreshold) {
          proxyStore.dispatch(scrolledToBottom({}));
        }
      }, scrollThrottleDuration)
    );
  })
  .then(() => {
    proxyStore.dispatch(popupLoaded());
  })
  .catch(console.error);
