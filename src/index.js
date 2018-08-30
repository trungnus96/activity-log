import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';

import store from './store';
import routes from './routes';
import './layouts/layout.scss';

ReactDOM.render(
  <AppContainer>
    <Provider store={store}>
      {routes}
    </Provider>
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./routes', () => {
    ReactDOM.render(
      <AppContainer>
        <Provider store={store}>
          {routes}
        </Provider>
      </AppContainer>,
      document.getElementById('root')
    )
  })
}

// registerServiceWorker();
