import Button from '@code-dot-org/component-library/button';
import {FontAwesomeV6IconProps} from '@code-dot-org/component-library/fontAwesomeV6Icon';
import React from 'react';

interface SuggestedPrompt {
  id: string;
  color: string;
  icon: FontAwesomeV6IconProps;
  text: string;
}

interface AiTutorSidebarSuggestedPromptsProps {
  prompts?: SuggestedPrompt[];
  onPromptSelect?: (prompt: SuggestedPrompt) => void;
  className?: string;
}

// These are basically the same as defaultChatButtonData in AiTutor2Chat, but
// adapted for the sidebar UI.
const defaultPrompts: SuggestedPrompt[] = [
  {
    id: 'example',
    color: 'green',
    icon: {
      iconName: 'code',
    },
    text: 'Show me an example',
  },
  {
    id: 'hint',
    color: 'yellow',
    icon: {
      iconName: 'lightbulb',
    },
    text: 'Give me a hint',
  },
  {
    id: 'documentation',
    color: 'blue',
    icon: {
      iconName: 'file-code',
    },
    text: 'Show documentation',
  },
];

const AiTutorSidebarSuggestedPrompts: React.FC<
  AiTutorSidebarSuggestedPromptsProps
> = ({prompts = defaultPrompts, onPromptSelect, className = ''}) => {
  const handlePromptClick = (prompt: SuggestedPrompt) => {
    if (onPromptSelect) {
      onPromptSelect(prompt);
    }
  };

  return (
    <div className={`ai-tutor-suggested-prompts ${className}`}>
      <div className="ai-tutor-suggested-prompts-list">
        {prompts.map(prompt => (
          <Button
            className={'ai-tutor-suggested-prompt-item'}
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
