import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Drawer as MuiDrawer,
  List,
  Divider,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon,
  DirectionsWalk as DirectionsWalkIcon,
  Flag as FlagIcon,
  People as PeopleIcon,
  EmojiEvents as EmojiEventsIcon,
  SettingsAccessibility as SettingsAccessibilityIcon,
  FamilyRestroom as FamilyRestroomIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const drawerWidth = 240;

export default function DrawerComponent({ open, toggleDrawer }) {
  const theme = useTheme();
  const location = useLocation();

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
        backgroundColor: theme.palette.background.default,
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

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  }));

  const StyledListItemButton = styled(ListItemButton)(({ theme, active }) => ({
    margin: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    ...(active && {
      backgroundColor: theme.palette.primary.light,
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
      },
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.primary.contrastText,
      },
    }),
  }));

  const menuItems = [
    { text: '활동', icon: <DirectionsWalkIcon />, path: '/activity' },
    { text: '목표', icon: <FlagIcon />, path: '/goals' },
    { text: '커뮤니티', icon: <PeopleIcon />, path: '/community' },
    { text: '챌린지(도전)', icon: <EmojiEventsIcon />, path: '/challenges' },
    { text: '가족관리', icon: <FamilyRestroomIcon />, path: '/families' },
    { text: '자세인식', icon: <SettingsAccessibilityIcon />, path: '/posture' },
  ];

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
        </Typography>
        <IconButton onClick={toggleDrawer} sx={{ color: 'inherit' }}>
          {open ? <ChevronRightIcon /> : <MenuIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List component="nav" sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <StyledListItemButton
            key={item.text}
            component={RouterLink}
            to={item.path}
            active={location.pathname === item.path ? 1 : 0}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{ opacity: open ? 1 : 0 }}
            />
          </StyledListItemButton>
        ))}
      </List>
    </Drawer>
  );
}

