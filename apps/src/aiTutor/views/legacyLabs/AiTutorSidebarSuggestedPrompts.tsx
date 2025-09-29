import Button from '@code-dot-org/component-library/button';
import {FontAwesomeV6IconProps} from '@code-dot-org/component-library/fontAwesomeV6Icon';
import React from 'react';

import styles from './AiTutorSidebar.module.scss';
interface SuggestedPrompt {
  id: string;
  icon: FontAwesomeV6IconProps;
  text: string;
}

interface AiTutorSidebarSuggestedPromptsProps {
  onPromptSelect?: (prompt: SuggestedPrompt) => void;
  className?: string;
  inLevel?: boolean;
}

const AiTutorSidebarSuggestedPrompts: React.FC<
  AiTutorSidebarSuggestedPromptsProps
> = ({onPromptSelect, className = '', inLevel = false}) => {
  const handlePromptClick = (prompt: SuggestedPrompt) => {
    if (onPromptSelect) {
      onPromptSelect(prompt);
    }
  };

  const defaultPrompts: SuggestedPrompt[] = [
    {
      id: 'documentation',
      icon: {
        iconName: 'file-code',
      },
      text: 'Show documentation',
    },
  ];

  const levelPrompts: SuggestedPrompt[] = [
    {
      id: 'example',
      icon: {
        iconName: 'code',
      },
      text: 'Show me an example',
    },
    {
      id: 'hint',
      icon: {
        iconName: 'lightbulb',
      },
      text: 'Give me a hint',
    },
  ];

  const standaloneProjectPrompts: SuggestedPrompt[] = [
    {
      id: 'brainstorm',
      icon: {
        iconName: 'brain',
      },
      text: 'Help me brainstorm',
    },
    {
      id: 'debug',
      icon: {
        iconName: 'bug',
      },
      text: 'Help me debug',
    },
    {
      id: 'projects',
      icon: {
        iconName: 'star',
      },
      text: 'Show me example projects',
    },
  ];

  const allPrompts = inLevel
    ? [...levelPrompts, ...defaultPrompts]
    : [...standaloneProjectPrompts, ...defaultPrompts];

  return (
    <div className={`ai-tutor-suggested-prompts ${className}`}>
      <div className="ai-tutor-suggested-prompts-list">
        {allPrompts.map(prompt => (
          <Button
            className={styles['ai-tutor-suggested-prompt-item']}
            aria-label={prompt.text}
            isIconOnly
            icon={prompt.icon}
            onClick={() => handlePromptClick(prompt)}
            key={prompt.id}
            size="m"
            type="primary"
            color="white"
          />
        ))}
      </div>
    </div>
  );
};

export default AiTutorSidebarSuggestedPrompts;
