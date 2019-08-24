import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
// import { Provider } from 'mobx-react';

import Root from '../config/Router';

const init = Component => {
  render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById(`root`),
  );
};

init(Root);

if (module.hot) {
  module.hot.accept(`../config/Router`, () => {
    const newApp = require(`../config/Router`).default;
    init(newApp);
  });
}
