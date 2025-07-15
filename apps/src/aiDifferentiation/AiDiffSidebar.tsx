import {Box, List, ListItem, ListItemButton, ListItemText} from '@mui/material';
import React from 'react';

import styles from '@cdo/apps/templates/teacherNavigation/teacher-navigation.module.scss';
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
          <List>
            {['This is one chat', 'This is another chat'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </div>
    </aside>
  );
};

export default AiDiffSidebar;
