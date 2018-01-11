import * as React from 'react';
import {render} from 'react-dom';
import {Store} from 'react-chrome-redux';
import {Provider} from 'react-redux';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import OptionContainer from './containers/option';

const extension: string = '/* @echo extension */';
const proxyStore = new Store({
  portName: 'extension-demo-app',
  extensionId: extension === 'firefox' ? 'my-app-id@mozilla.org' : ''
});

proxyStore.ready().then(() => {
  render((
    <Provider store={proxyStore as any}>
      <OptionContainer />
    </Provider>
  ), document.getElementById('app'));
}).catch(console.error);
