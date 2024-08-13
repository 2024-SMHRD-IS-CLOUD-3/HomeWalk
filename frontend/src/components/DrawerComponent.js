import React from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import FlagIcon from '@mui/icons-material/Flag';
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import { Link as RouterLink } from 'react-router-dom';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

export default function DrawerComponent({ open, toggleDrawer }) {
  return (
    <Drawer variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        <ListItemButton component={RouterLink} to="/activity">
          <ListItemIcon>
            <DirectionsWalkIcon />
          </ListItemIcon>
          <ListItemText primary="활동" />
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/goals">
          <ListItemIcon>
            <FlagIcon />
          </ListItemIcon>
          <ListItemText primary="목표" />
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/community">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="커뮤니티" />
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/challenges">
          <ListItemIcon>
            <EmojiEventsIcon />
          </ListItemIcon>
          <ListItemText primary="챌린지(도전)" />
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/families">
          <ListItemIcon>
            <FamilyRestroomIcon />
          </ListItemIcon>
          <ListItemText primary="가족관리" />
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/posture">
          <ListItemIcon>
            <SettingsAccessibilityIcon />
          </ListItemIcon>
          <ListItemText primary="자세인식" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
