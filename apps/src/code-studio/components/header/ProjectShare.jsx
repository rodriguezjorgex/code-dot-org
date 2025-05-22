import classNames from 'classnames';
import React from 'react';

import {shareLab2Project} from '@cdo/apps/lab2/header/lab2HeaderShare';
import Lab2Registry from '@cdo/apps/lab2/Lab2Registry';
import i18n from '@cdo/locale';

import {shareProject} from '../../headerShare';

import styles from './project-header.module.scss';

const ProjectShare = () => {
  const onProjectShare = () => {
    if (Lab2Registry.hasEnabledProjects()) {
      // If we are using Lab2, share using the project manager and
      // shareLab2Project.
      shareLab2Project();
    } else {
      // Otherwise, we are using the legacy labs system, get the share url from that system
      // and share using shareProject.
      shareProject(dashboard.project.getShareUrl());
    }
  };

  return (
    <button
      type="button"
      className={classNames(
        styles.buttonSpacing,
        'project_share',
        'header_button',
        'header_button_light',
        'no-mc'
      )}
      onClick={onProjectShare}
    >
      {i18n.share()}
    </button>
  );
};

export default ProjectShare;
