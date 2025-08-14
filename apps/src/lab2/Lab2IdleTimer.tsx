import React from 'react';
import IdleTimer from 'react-idle-timer';
import {useDispatch} from 'react-redux';

import {setStartIdle, setEndIdle} from '@cdo/apps/code-studio/progressRedux';

const IDLE_AFTER = 1000 * 60 * 2; // 2 minutes

const Lab2IdleTimer: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <IdleTimer
      timeout={IDLE_AFTER}
      onIdle={() => dispatch(setStartIdle())}
      onActive={() => dispatch(setEndIdle())}
    />
  );
};

export default Lab2IdleTimer;
