declare const process: any;
import { applyMiddleware, createStore, Middleware } from "redux";
import { wrapStore } from "react-chrome-redux";
import createSagaMiddleware from "redux-saga";
import { createLogger } from "redux-logger";

import rootReducer, { Store } from "./reducers";
import { initialize } from "./actions";
import mySaga from "./sagas";
import { AnyAction } from "typescript-fsa";

const saga = createSagaMiddleware();

let middlewares: Middleware[];
if (process.env.NODE_ENV === "production") {
  middlewares = [saga];
} else {
  const logger = createLogger();
  middlewares = [saga, logger];
}
const store = createStore<Store, AnyAction, any, any>(
  rootReducer,
  applyMiddleware(...middlewares)
);

if (process.env.NODE_ENV !== "production") {
  (window as any).store = store;
}

saga.run(mySaga);

wrapStore(store, {
  portName: "in-site-history"
});
store.dispatch(initialize({}));
