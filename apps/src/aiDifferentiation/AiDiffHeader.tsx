import Button from '@code-dot-org/component-library/button';
import Tags from '@code-dot-org/component-library/tags';
import classNames from 'classnames';
import React from 'react';

import i18n from '@cdo/locale';
import aiBotOutlineIcon from '@cdo/static/ai-bot-outline.png';

import style from './ai-differentiation.module.scss';
// TODO: Update to support i18n
const AI_DIFF_HEADER_TEXT = 'AI Teaching Assistant';

interface AiDiffHeaderProps {
  closeTutor?: () => void;
}

const AiDiffHeader: React.FC<AiDiffHeaderProps> = ({closeTutor}) => {
  return (
    <div className={classNames(style.aiDiffHeader, 'ai_diff_handle')}>
      <div className={style.aiDiffHeaderLeftSide}>
        <div className={style.aiBotHeader}>
          <img
            src={aiBotOutlineIcon}
            className={style.aiBotOutlineIcon}
            alt={AI_DIFF_HEADER_TEXT}
          />
          <div className={style.taOverlayHeader}>
            <span>{'TA'}</span>
          </div>
        </div>
        <span className={style.aiDiffHeaderText}>{AI_DIFF_HEADER_TEXT}</span>
        <span>
          <Tags
            tagsList={[{label: i18n.experiment()}]}
            size="s"
            className={style.headerTag}
          />
        </span>
      </div>
      <div className={style.aiDiffHeaderRightSide}>
        <Button
          color="white"
          icon={{iconName: 'times', iconStyle: 'solid'}}
          type="tertiary"
          isIconOnly={true}
          onClick={closeTutor}
          size="s"
        />
      </div>
    </div>
  );
};

export default AiDiffHeader;
