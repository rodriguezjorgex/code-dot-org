import Button from '@code-dot-org/component-library/button';
import React from 'react';

import aiBotOutlineIcon from '@cdo/static/ai-bot-outline.png';

import './ai-tutor-sidebar.scss';
import AiTutorSidebarSuggestedPrompts from './AiTutorSidebarSuggestedPrompts';

interface AiTutorSidebarProps {
  toggleAiChat: () => void;
}

const AiTutorSidebar: React.FC<AiTutorSidebarProps> = ({toggleAiChat}) => {
  return (
    <div className="ai-tutor-sidebar">
      <div className="ai-tutor-sidebar-header">
        <div className="bot-icon-container">
          <img src={aiBotOutlineIcon} alt="" className="bot-icon" />
        </div>
      </div>
      <div className="ai-tutor-sidebar-content">
        <Button
          className={'ai-tutor-suggested-prompt-item'}
          aria-label="Open AI tutor"
          isIconOnly
          icon={{iconName: 'arrow-from-right'}}
          onClick={toggleAiChat}
          size="m"
          type="primary"
          color="white"
        />
        <AiTutorSidebarSuggestedPrompts />
      </div>
    </div>
  );
};

export default AiTutorSidebar;
