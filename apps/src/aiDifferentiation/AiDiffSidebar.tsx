import Button, {buttonColors} from '@code-dot-org/component-library/button';
import Link from '@code-dot-org/component-library/link';
import {Box, List, ListItem, ListItemButton, ListItemText} from '@mui/material';
import React from 'react';

import {commonI18n} from '@cdo/apps/types/locale';

import styles from './ai-differentiation.module.scss';

interface AiDiffSidebarProps {
  // Props will go here :)
}

const drawerWidth = 240;

const AiDiffSidebar: React.FC<AiDiffSidebarProps> = props => {
  return (
    <aside className={styles.sidebarContainer}>
      <div className={styles.sidebarContent}>
        <Box
          component="nav"
          sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
          aria-label="AI differentiation chat threads"
        >
          <Button
            color={buttonColors.white}
            size="m"
            type="primary"
            iconLeft={{iconName: 'plus'}}
            onClick={() => console.log('Add new chat thread')}
            text={commonI18n.aiDifferentiation_new_chat()}
            className={styles.sidebarButton}
          />
          <List>
            {['This is one chat', 'This is another chat'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Link
            href="#"
            onClick={() => console.log('Manage chats clicked')}
            text={commonI18n.aiDifferentiation_manage_chats()}
            size="s"
            className={styles.sidebarManageLink}
          />
        </Box>
      </div>
    </aside>
  );
};

export default AiDiffSidebar;
