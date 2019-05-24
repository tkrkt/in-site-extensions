declare const process: any;
import { wrapStore } from "webext-redux";
import { applyMiddleware, createStore, Middleware } from "redux";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "redux-saga";

import { initialize } from "./actions";
import rootReducer, { Store } from "./reducers";
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
  portName: "in-site-bookmark"
});
store.dispatch(initialize());
