import { browser } from "webextension-polyfill-ts";
import { eventChannel, SagaIterator } from "redux-saga";
import { call, fork, put, select, take, takeEvery } from "redux-saga/effects";
import { bindAsyncAction } from "typescript-fsa-redux-saga";
import {
  addBookmark,
  addBookmarkWorker,
  exportHosts,
  importHosts,
  initialize,
  openBookmark,
  pageChanged,
  removeBookmark,
  removeBookmarkWorker,
  removeHost,
  removeHostWorker,
  setHosts,
  sortBookmark,
  sortBookmarkWorker
} from "../actions";
import * as repogitory from "../apis/repogitory";
import * as tab from "../apis/tab";
import { Bookmark, Hosts, Page, Store } from "../reducers";
import generateHtml from "../utils/generateHtml";
import { getDomainName } from "../utils/url";

function* initializeSaga() {
  yield fork(function*() {
    const hosts: Hosts = yield call(repogitory.getAllHosts);
    yield put(setHosts(hosts));
  });
  browser.browserAction.setBadgeBackgroundColor({
    color: "#666"
  });
}

const addBookmarkSaga = bindAsyncAction(addBookmarkWorker)(function*({
  payload: { page }
}): SagaIterator {
  const hosts: Hosts = yield select((state: Store) => state.hosts);
  const pageResult = page.result;
  if (pageResult) {
    const host = hosts[pageResult.host.url];
    const bookmarks = host
      ? host.bookmarks.filter(b => b.url !== pageResult.bookmark.url)
      : [];
    yield call(repogitory.setHost, {
      url: pageResult.host.url,
      domain: getDomainName(pageResult.host.url),
      favicon: pageResult.host.favicon,
      bookmarks: [...bookmarks, pageResult.bookmark]
    });
  } else {
    throw new Error("store.page is undefined");
  }
});

const removeBookmarkSaga = bindAsyncAction(removeBookmarkWorker)(function*({
  payload: { host, bookmark }
}): SagaIterator {
  const bookmarks = host.bookmarks.filter(b => b.url !== bookmark.url);
  if (bookmarks.length) {
    yield call(repogitory.setHost, {
      ...host,
      bookmarks
    });
  } else {
    yield call(repogitory.removeHost, host.url);
  }
});

const sortBookmarkSaga = bindAsyncAction(sortBookmarkWorker)(function*({
  payload: { host, bookmarks }
}): SagaIterator {
  yield call(repogitory.setHost, {
    ...host,
    bookmarks
  });
});

const removeHostSaga = bindAsyncAction(removeHostWorker)(function*({
  payload: { host }
}): SagaIterator {
  yield call(repogitory.removeHost, host.url);
});

function* openBookmarkSaga({
  payload: { bookmark, openInNew }
}: {
  payload: { bookmark: Bookmark; openInNew: boolean };
}) {
  yield call(tab.openTab, bookmark.url, openInNew);
  yield call(tab.closePopup);
}

const watchTabsChannel = () => {
  return eventChannel<Page>(emitter => {
    return tab.watchCurrentPage(emitter);
  });
};

function* changePageSaga(page: Page) {
  if (page.result) {
    const hosts: Hosts = yield select((state: Store) => state.hosts);
    const host = hosts[page.result.host.url];
    if (host && !host.favicon && page.result.host.favicon) {
      yield call(repogitory.setHost, {
        ...host,
        favicon: page.result.host.favicon
      });
    }
  }
  yield put(pageChanged({ page }));
}

function* updateBadgeSaga() {
  const { hosts, page }: { hosts: Hosts; page: Page } = yield select(
    (state: Store) => ({
      hosts: state.hosts,
      page: state.page
    })
  );
  if (page.result) {
    const hostUrl = page.result.host.url;
    if (hosts[hostUrl] && hosts[hostUrl].bookmarks.length) {
      browser.browserAction.setBadgeText({
        text: "" + hosts[hostUrl].bookmarks.length
      });
    } else {
      browser.browserAction.setBadgeText({ text: "" });
    }
  } else {
    browser.browserAction.setBadgeText({ text: "" });
  }
}

function* exportHostsSaga() {
  const hosts = yield select((state: Store) => state.hosts);
  const html = generateHtml(hosts);
  const blob = new Blob([html], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  browser.downloads.download({
    url,
    filename: "bookmarks.html"
  });
}

function* importHostsSaga({
  payload: { hosts }
}: {
  payload: { hosts: Hosts };
}) {
  const currentHosts: Hosts = yield select((state: Store) => state.hosts);
  const nextHosts = { ...currentHosts };
  for (const key of Object.keys(hosts)) {
    const currentHost = currentHosts[key];
    const loadHost = hosts[key];
    if (currentHost) {
      const bookmarks = currentHost.bookmarks;
      loadHost.bookmarks.forEach(bookmark => {
        if (currentHost.bookmarks.some(b => b.path === bookmark.path)) {
          // nop (duplicated)
        } else {
          bookmarks.push(bookmark);
        }
      });
      nextHosts[key] = {
        url: currentHost.url || loadHost.url,
        domain: getDomainName(currentHost.url || loadHost.url),
        favicon: currentHost.favicon || loadHost.favicon,
        bookmarks
      };
    } else {
      nextHosts[key] = hosts[key];
    }

    yield call(repogitory.setHost, nextHosts[key]);
  }
  yield put(setHosts(nextHosts));
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
  yield takeEvery(exportHosts as any, exportHostsSaga);
  yield takeEvery(importHosts as any, importHostsSaga);
  const channel = yield call(watchTabsChannel);
  yield takeEvery(channel, changePageSaga);
}
