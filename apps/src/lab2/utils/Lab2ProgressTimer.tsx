// apps/src/lab2/utils/Lab2ProgressTimer.tsx
import React, {useEffect} from 'react';
import IdleTimer from 'react-idle-timer';

class Lab2ProgressTimer {
  private milestoneStartTime: number;
  private idleStartTime: number | null = null;
  private accumulatedIdleTime: number = 0;

  private static instance: Lab2ProgressTimer;

  private constructor() {
    this.milestoneStartTime = Date.now();
  }

  static getInstance(): Lab2ProgressTimer {
    if (!Lab2ProgressTimer.instance) {
      Lab2ProgressTimer.instance = new Lab2ProgressTimer();
    }
    return Lab2ProgressTimer.instance;
  }

  resetMilestoneTimer() {
    this.milestoneStartTime = Date.now();
    this.idleStartTime = null;
    this.accumulatedIdleTime = 0;
  }

  startIdle() {
    if (!this.idleStartTime) {
      this.idleStartTime = Date.now();
    }
  }

  endIdle() {
    if (this.idleStartTime) {
      const now = Date.now();
      this.accumulatedIdleTime += now - this.idleStartTime;
      this.idleStartTime = null;
    }
  }

  getTimeSinceLastMilestone(): number {
    const now = Date.now();
    const currentIdle = this.idleStartTime ? now - this.idleStartTime : 0;
    return (
      now - this.milestoneStartTime - (this.accumulatedIdleTime + currentIdle)
    );
  }

  static Mount: React.FC<{resetOnMount?: boolean}> = ({
    resetOnMount = true,
  }) => {
    const IDLE_AFTER = 1000 * 60 * 2;
    const timer = Lab2ProgressTimer.getInstance();

    useEffect(() => {
      if (resetOnMount) timer.resetMilestoneTimer();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetOnMount]);

    return (
      <IdleTimer
        timeout={IDLE_AFTER}
        onIdle={() => timer.startIdle()}
        onActive={() => timer.endIdle()}
      />
    );
  };
}

export default Lab2ProgressTimer;
