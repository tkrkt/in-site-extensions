import { eventChannel, SagaIterator } from "redux-saga";
import { call, take, takeEvery, select, fork, put } from "redux-saga/effects";
import { Store, Page, History, Histories } from "../reducers";
import * as tabApi from "../apis/tab";
import * as historyApi from "../apis/history";
import {
  initialize,
  pageChanged,
  openHistory,
  removeHistory,
  removeAllHistories,
  historyLoaded,
  loadHistory,
  loadMoreHistory,
  scrolledToBottom
} from "../actions";
import { isValid } from "../utils/url";

const delay = (millis: number) => new Promise(r => setTimeout(r, millis));

function* initializeSaga() {
  // nop
}

function* openHisotrySaga({
  payload: { history, openInNew }
}: {
  payload: { history: History; openInNew: boolean };
}) {
  yield call(tabApi.openTab, history.url, openInNew);
  yield call(tabApi.closePopup);
}

function* removeHistorySaga({
  payload: { history }
}: {
  payload: { history: History };
}) {
  yield call(historyApi.removeHistory, history);
}

function* removeAllHistoriesSaga({
  payload: { host }
}: {
  payload: { host: string };
}) {
  const histories: Histories = yield select((store: Store) => store.histories);
  if (histories.host === host) {
    yield call(historyApi.removeAllHistories, histories);
  }
}

const watchTabsChannel = () => {
  return eventChannel<Page>(emitter => {
    return tabApi.watchCurrentPage(emitter);
  });
};

function* changePageSaga(page: Page) {
  yield put(pageChanged({ page }));
  yield call(tabApi.closePopup);
}

function* getHistorySaga({ payload: { page } }: { payload: { page: Page } }) {
  if (page.result && isValid(page.result.url)) {
    const histories = yield call(historyApi.getHistory, page.result.host);
    yield put(historyLoaded({ histories }));
  }
}

function* getCurrentHistorySaga() {
  const page: Page | undefined = yield select((state: Store) => state.page);
  if (page && page.result) {
    const histories = yield call(historyApi.getHistory, page.result.host);
    yield put(historyLoaded({ histories }));
  }
}

function* getMoreHistorySaga() {
  const currentHistories: Histories = yield select(
    (state: Store) => state.histories
  );
  const nextHistories = yield call(historyApi.getMoreHistory, currentHistories);
  yield put(historyLoaded({ histories: nextHistories }));
}

function* scrolledToBottomSaga() {
  const histories: Histories = yield select((state: Store) => state.histories);
  if (!histories.completed) {
    yield delay(100);
    yield put(loadMoreHistory({}));
  }
}

export default function* saga(): SagaIterator {
  // initialize
  yield take(initialize);
  yield fork(initializeSaga);

  const channel = yield call(watchTabsChannel);
  yield takeEvery(channel, changePageSaga);
  yield takeEvery(openHistory as any, openHisotrySaga);
  yield takeEvery(removeHistory as any, removeHistorySaga);
  yield takeEvery(removeAllHistories as any, removeAllHistoriesSaga);
  yield takeEvery(pageChanged as any, getHistorySaga);
  yield takeEvery(loadHistory as any, getCurrentHistorySaga);
  yield takeEvery(loadMoreHistory as any, getMoreHistorySaga);
  yield takeEvery(scrolledToBottom as any, scrolledToBottomSaga);
}
