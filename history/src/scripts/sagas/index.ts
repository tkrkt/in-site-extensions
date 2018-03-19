import {eventChannel, delay, SagaIterator} from 'redux-saga';
import {call, take, takeEvery, select, fork, put} from 'redux-saga/effects';
import {bindAsyncAction} from 'typescript-fsa-redux-saga';
import {Store, Page, History, Histories} from '../reducers';
import ext from '../apis/ext';
import * as tabApi from '../apis/tab';
import * as historyApi from '../apis/history';
import {
  initialize,
  pageChanged,
  openHistory,
  removeHistory,
  removeAllHistories,
  historyLoaded
} from '../actions';
import {isValid} from '../utils/url';

function* initializeSaga() {
  // nop
}

function* openHisotrySaga({payload: {history, openInNew}}: {payload: {history: History, openInNew: boolean}}) {
  yield call(tabApi.openTab, history.url, openInNew);
  yield call(tabApi.closePopup);
}

function* removeHistorySaga({payload: {history}}: {payload: {history: History}}) {
  yield call(historyApi.removeHistory, history);
}

function* removeAllHistoriesSaga({payload: {host}}: {payload: {host: string}}) {
  yield call(historyApi.removeAllHistories, host);
}

const watchTabsChannel = () => {
  return eventChannel<Page>((emitter) => {
    return tabApi.watchCurrentPage(emitter);
  });
};

function* changePageSaga(page: Page) {
  yield put(pageChanged({page}));
  yield call(tabApi.closePopup);
}

function* getHistorySaga({payload: {page}}: {payload: {page: Page}}) {
  if (page.result && isValid(page.result.url)) {
    const histories = yield call(historyApi.getHistory, page.result.host);
    yield put(historyLoaded({histories}));
  }
}

export default function* saga(): SagaIterator {
  // initialize
  yield take(initialize);
  yield fork(initializeSaga);

  const channel = yield call(watchTabsChannel);
  yield takeEvery(channel, changePageSaga);
  yield takeEvery((openHistory as any), openHisotrySaga);
  yield takeEvery((removeHistory as any), removeHistorySaga);
  yield takeEvery((removeAllHistories as any), removeAllHistoriesSaga);
  yield takeEvery((pageChanged as any), getHistorySaga);
}
