import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import RegionalWorkshopCatalog from '@cdo/apps/code-studio/pd/professional_learning/RegionalWorkshopCatalog';
import {getStore} from '@cdo/apps/redux';

$(() => {
  const store = getStore();

  ReactDOM.render(
    <Provider store={store}>
      <RegionalWorkshopCatalog />
    </Provider>,
    document.getElementById('regional-workshop-catalog')
  );
});
