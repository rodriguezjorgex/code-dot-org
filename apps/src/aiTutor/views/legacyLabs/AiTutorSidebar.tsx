import React from 'react';
import aiBotOutlineIcon from '@cdo/static/ai-bot-outline.png';
import './ai-tutor-sidebar.scss';
import AiTutorSidebarSuggestedPrompts from './AiTutorSidebarSuggestedPrompts';

interface AiTutorSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}

const AiTutorSidebar: React.FC<AiTutorSidebarProps> = ({
  isOpen = true,
  onClose,
  children,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="ai-tutor-sidebar">
      <div className="ai-tutor-sidebar-header">
        <div className="bot-icon-container">
          <img
            src={aiBotOutlineIcon}
            alt="AI Tutor Icon"
            className="bot-icon"
          />
        </div>

        {onClose && (
          <button
            className="ai-tutor-sidebar-close"
            onClick={onClose}
            aria-label="Close AI Tutor Sidebar"
          >
            ×
          </button>
        )}
      </div>
      <div className="ai-tutor-sidebar-content">
        <AiTutorSidebarSuggestedPrompts />
      </div>
    </div>
  );
};

export default AiTutorSidebar;
