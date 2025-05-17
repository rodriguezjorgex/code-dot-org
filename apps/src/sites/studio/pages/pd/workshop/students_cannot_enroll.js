import React from 'react';
import ReactDOM from 'react-dom';

import StudentUserTypeChangePrompt from '@cdo/apps/accounts/StudentUserTypeChangePrompt';

document.addEventListener('DOMContentLoaded', function () {
  ReactDOM.render(
    <StudentUserTypeChangePrompt />,
    document.getElementById('workshop-students-cannot-enroll')
  );
});
