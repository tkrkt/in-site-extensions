import * as React from 'react';
import {render} from 'react-dom';
import {Store} from 'react-chrome-redux';
import {Provider} from 'react-redux';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import PopupContainer from './containers/popup';

const extension: string = '/* @echo extension */';
const proxyStore = new Store({
  portName: 'in-site-history',
  extensionId: extension === 'firefox' ? 'in-site-history@tkrkt.com' : ''
});

proxyStore.ready().then(() => {
  render((
    <Provider store={proxyStore as any}>
      <PopupContainer />
    </Provider>
  ), document.getElementById('app'));
}).then(async () => {
  if (extension === 'chrome') {
    // dirty hack to fix drawings of popup window
    const appElement = document.getElementById('app');
    if (appElement) {
      for (let i = 0; i < 3; i++) {
        const height = appElement.getBoundingClientRect().height;
        document.body.style.height = `${height + 1}px`;
        await new Promise((r) => setTimeout(r, 100));
      }
      document.body.style.height = '';
      if (appElement.getBoundingClientRect().height > 600) {
        document.body.style.overflowY = 'scroll';
        appElement.style.height = '600px';
        appElement.style.overflowY = 'hidden';
        await new Promise((r) => setTimeout(r, 100));
        appElement.style.height = '';
        appElement.style.overflowY = '';
      }
    }
  }
}).catch(console.error);
