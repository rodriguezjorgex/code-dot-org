import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import isRtl from '@cdo/apps/code-studio/isRtlRedux';
import initResponsive from '@cdo/apps/code-studio/responsive';
import responsive from '@cdo/apps/code-studio/responsiveRedux';
import {EVENTS} from '@cdo/apps/metrics/AnalyticsConstants';
import analyticsReporter from '@cdo/apps/metrics/AnalyticsReporter';
import {getStore, registerReducers} from '@cdo/apps/redux';
import RegionalWorkshopCatalog from '@cdo/apps/templates/RegionalWorkshopCatalog';

registerReducers({isRtl, responsive});

$(document).ready(initRegionalWorkshopCatalog);

function showRegionalPartnerSearch() {
  const regionalWorkshopCatalogElement = $('#regional-workshop-catalog');
  const sourcePageId = 'program-information';

  analyticsReporter.sendEvent(EVENTS.RP_LANDING_PAGE_VISITED_EVENT);

  ReactDOM.render(
    <Provider store={getStore()}>
      <RegionalWorkshopCatalog sourcePageId={sourcePageId} />
    </Provider>,
    regionalWorkshopCatalogElement[0]
  );
}

function initRegionalWorkshopCatalog() {
  initResponsive();
  showRegionalPartnerSearch();
}
