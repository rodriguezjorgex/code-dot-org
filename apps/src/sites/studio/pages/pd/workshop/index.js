import React from 'react';
import ReactDOM from 'react-dom';

import WorkshopMarketingPage from '@cdo/apps/code-studio/pd/workshop/WorkshopMarketingPage';
import getScriptData from '@cdo/apps/util/getScriptData';

document.addEventListener('DOMContentLoaded', function () {
  const workshopInfo = getScriptData('workshopInfo');

  ReactDOM.render(
    <WorkshopMarketingPage workshopInfo={workshopInfo} />,
    document.getElementById('workshop-container')
  );
});
