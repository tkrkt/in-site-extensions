import {applyMiddleware, createStore} from 'redux';
import {wrapStore, alias} from 'react-chrome-redux';
import createSagaMiddleware from 'redux-saga';
import {createLogger} from 'redux-logger';

import rootReducer, {Store} from './reducers';
import {initialize} from './actions';
import mySaga from './sagas';

const logger = createLogger();
const saga = createSagaMiddleware();
const middlewares = [saga, logger];
const store = createStore<Store>(rootReducer,
  applyMiddleware(...middlewares)
);

saga.run(mySaga);

wrapStore(store, {
  portName: 'in-site-history'
});
store.dispatch(initialize({}));
