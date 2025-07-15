import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
} from '@mui/material';
import React from 'react';

interface AiDiffSidebarProps {
  // Define your props here if needed
}

const drawerWidth = 240;

const AiDiffSidebar: React.FC<AiDiffSidebarProps> = props => {
  return (
    <aside className="ai-diff-sidebar">
      <div>
        <Box
          component="nav"
          sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
          aria-label="mailbox folders"
        >
          <Drawer
            variant="permanent"
            sx={{
              display: {xs: 'none', sm: 'block'},
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
            open
          >
            <Toolbar />
            <Divider />
            <List>
              {['Inbox', 'Starred', 'Send email', 'Drafts'].map(
                (text, index) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                )
              )}
            </List>
          </Drawer>
        </Box>
      </div>
    </aside>
  );
};

export default AiDiffSidebar;
