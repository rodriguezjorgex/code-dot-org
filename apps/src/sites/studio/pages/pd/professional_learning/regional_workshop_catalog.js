import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';

import RegionalWorkshopCatalog from '@cdo/apps/code-studio/pd/professional_learning/RegionalWorkshopCatalog';
import {queryParams} from '@cdo/apps/code-studio/utils';
import getScriptData from '@cdo/apps/util/getScriptData';

$(() => {
  // Pass in the user's zip code if present as a url param or known through the user's school info.
  let zip = queryParams()['zip'];
  if (!zip) {
    zip = getScriptData('zipCode');
  }

  ReactDOM.render(
    <RegionalWorkshopCatalog zip={zip} />,
    document.getElementById('regional-workshop-catalog')
  );
});
