import {eventChannel, delay, SagaIterator} from 'redux-saga';
import {call, take, takeEvery, select, fork, put} from 'redux-saga/effects';
import {bindAsyncAction} from 'typescript-fsa-redux-saga';
import {Store, Hosts, Host, Bookmark, Page} from '../reducers';
import ext from '../apis/ext';
import * as tab from '../apis/tab';
import * as repogitory from '../apis/repogitory';
import {
  initialize,
  initHosts,
  addBookmark,
  removeBookmark,
  addBookmarkWorker,
  openBookmark,
  pageChanged
} from '../actions';

function* initializeSaga() {
  yield fork(function*() {
    const hosts: Hosts = yield call(repogitory.getAllHosts);
    yield put(initHosts(hosts));
  });
  ext.browserAction.setBadgeBackgroundColor({
    color: '#666'
  });
}

const addBookmarkSaga = bindAsyncAction(addBookmarkWorker)(
  function*(): SagaIterator {
    const {hosts, page}: {hosts: Hosts, page: Page} = yield select((state: Store) => ({
      hosts: state.hosts,
      page: state.page
    }));
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

  yield takeEvery(addBookmark, addBookmarkSaga);
  yield takeEvery(openBookmark as any, openBookmarkSaga);
  yield takeEvery(pageChanged as any, updateBadgeSaga);
  yield takeEvery(addBookmark as any, updateBadgeSaga);
  yield takeEvery(removeBookmark as any, updateBadgeSaga);
  const channel = yield call(watchTabsChannel);
  yield takeEvery(channel, changePageSaga);
}
