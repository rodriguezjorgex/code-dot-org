/**
 * Lab2
 *
 * The top-level component that houses all Lab2 framework components.
 */
import {ThemeProvider} from '@code-dot-org/component-library/common/contexts';
import {ThemeProvider as MuiThemeProvider} from '@mui/material/styles';
import React from 'react';
import {Provider} from 'react-redux';

import {getStandaloneProjectId} from '@cdo/apps/lab2/projects/utils';
import {getStore} from '@cdo/apps/redux';
import BrowserTextToSpeechWrapper from '@cdo/apps/sharedComponents/BrowserTextToSpeechWrapper';
import theme from '@cdo/apps/themes/code.org';

import ProjectContainer from '../projects/ProjectContainer';

import RubricFABContainer from './components/rubrics/RubricFABContainer';
import RubricWrapper from './components/rubrics/RubricWrapper';
import DialogManager from './dialogs/DialogManager';
import Lab2Wrapper from './Lab2Wrapper';
import LabViewsRenderer from './LabViewsRenderer';
import MetricsAdapter from './MetricsAdapter';

const Lab2: React.FunctionComponent = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={getStore()}>
        <BrowserTextToSpeechWrapper>
          <RubricWrapper>
            <ThemeProvider>
              <Lab2Wrapper>
                <DialogManager>
                  <MetricsAdapter />
                  <ProjectContainer channelId={getStandaloneProjectId()}>
                    <LabViewsRenderer />
                  </ProjectContainer>
                  <RubricFABContainer />
                </DialogManager>
              </Lab2Wrapper>
            </ThemeProvider>
          </RubricWrapper>
        </BrowserTextToSpeechWrapper>
      </Provider>
    </MuiThemeProvider>
  );
};

export default Lab2;
