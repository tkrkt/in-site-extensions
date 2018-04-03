import {eventChannel, delay, SagaIterator} from 'redux-saga';
import {call, take, takeEvery, select, fork, put} from 'redux-saga/effects';
import {bindAsyncAction} from 'typescript-fsa-redux-saga';
import {Store, Hosts, Host, Bookmark, Page} from '../reducers';
import ext from '../apis/ext';
import * as tab from '../apis/tab';
import * as repogitory from '../apis/repogitory';
import {
  initialize,
  setHosts,
  addBookmark,
  addBookmarkWorker,
  removeBookmark,
  removeBookmarkWorker,
  removeHost,
  removeHostWorker,
  sortBookmark,
  sortBookmarkWorker,
  openBookmark,
  pageChanged
} from '../actions';

function* initializeSaga() {
  yield fork(function*() {
    const hosts: Hosts = yield call(repogitory.getAllHosts);
    yield put(setHosts(hosts));
  });
  ext.browserAction.setBadgeBackgroundColor({
    color: '#666'
  });
}

const addBookmarkSaga = bindAsyncAction(addBookmarkWorker)(
  function*({payload: {page}}): SagaIterator {
    const hosts: Hosts = yield select((state: Store) => state.hosts);
    const pageResult = page.result;
    if (pageResult) {
      const host = hosts[pageResult.host.url];
      const bookmarks = (host ? host.bookmarks.filter((b) => b.url !== pageResult.bookmark.url) : []);
      yield call(repogitory.setHost, {
        url: pageResult.host.url,
        favicon: pageResult.host.favicon,
        bookmarks: [...bookmarks, pageResult.bookmark]
      });
    } else {
      throw new Error('store.page is undefined');
    }
  }
);

const removeBookmarkSaga = bindAsyncAction(removeBookmarkWorker)(
  function*({payload: {host, bookmark}}): SagaIterator {
    const bookmarks = host.bookmarks.filter((b) => b.url !== bookmark.url);
    if (bookmarks.length) {
      yield call(repogitory.setHost, {
        ...host,
        bookmarks
      });
    } else {
      yield call(repogitory.removeHost, host.url);
    }
  }
);

const sortBookmarkSaga = bindAsyncAction(sortBookmarkWorker)(
  function*({payload: {host, bookmarks}}): SagaIterator {
    yield call(repogitory.setHost, {
      ...host,
      bookmarks
    });
  }
);

const removeHostSaga = bindAsyncAction(removeHostWorker)(
  function*({payload: {host}}): SagaIterator {
    yield call(repogitory.removeHost, host.url);
  }
);

function* openBookmarkSaga({payload: {bookmark, openInNew}}: {payload: {bookmark: Bookmark, openInNew: boolean}}) {
  yield call(tab.openTab, bookmark.url, openInNew);
  yield call(tab.closePopup);
}

const watchTabsChannel = () => {
  return eventChannel<Page>((emitter) => {
    return tab.watchCurrentPage(emitter);
  });
};

function* changePageSaga(page: Page) {
  yield put(pageChanged({page}));
}

function* updateBadgeSaga() {
  const {hosts, page}: {hosts: Hosts, page: Page} = yield select((state: Store) => ({
    hosts: state.hosts,
    page: state.page
  }));
  if (page.result) {
    const hostUrl = page.result.host.url;
    if (hosts[hostUrl] && hosts[hostUrl].bookmarks.length) {
      ext.browserAction.setBadgeText({
        text: '' + hosts[hostUrl].bookmarks.length
      });
    } else {
      ext.browserAction.setBadgeText({text: ''});
    }
  } else {
    ext.browserAction.setBadgeText({text: ''});
  }
}

export default function* saga(): SagaIterator {
  // initialize
  yield take(initialize);
  yield fork(initializeSaga);

  yield takeEvery(addBookmark as any, addBookmarkSaga);
  yield takeEvery(removeBookmark as any, removeBookmarkSaga);
  yield takeEvery(removeHost as any, removeHostSaga);
  yield takeEvery(openBookmark as any, openBookmarkSaga);
  yield takeEvery(pageChanged as any, updateBadgeSaga);
  yield takeEvery(addBookmark as any, updateBadgeSaga);
  yield takeEvery(removeBookmark as any, updateBadgeSaga);
  yield takeEvery(sortBookmark as any, sortBookmarkSaga);
  const channel = yield call(watchTabsChannel);
  yield takeEvery(channel, changePageSaga);
}
