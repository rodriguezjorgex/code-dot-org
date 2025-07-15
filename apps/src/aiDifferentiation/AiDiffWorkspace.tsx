import React from 'react';

import AiDiffChat from './AiDiffChat';
import AiDiffSidebar from './AiDiffSidebar';
import {Context} from './types';

import style from './ai-differentiation.module.scss';

interface AiDiffWorkSpaceProps {
  context: Context;
  scriptName?: string;
  unitDisplayName?: string;
  curriculumCourses?: string[];
}

const AiDiffWorkSpace: React.FC<AiDiffWorkSpaceProps> = ({
  context,
  scriptName,
  unitDisplayName,
  curriculumCourses,
}) => {
  return (
    <div className={style.aiDiffWorkspace}>
      <AiDiffSidebar />
      <AiDiffChat
        context={context}
        scriptName={scriptName}
        unitDisplayName={unitDisplayName}
        curriculumCourses={curriculumCourses}
      />
    </div>
  );
};

export default AiDiffWorkSpace;
