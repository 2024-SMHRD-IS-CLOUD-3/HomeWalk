import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUnreadNotifications, markNotificationAsRead } from '../api/notifications';
import { Menu, MenuItem, ListItemText } from '@mui/material';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.common.white,
    '&:hover': {
        backgroundColor: theme.palette.common.white,
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

export default function AppBarComponent({ open, toggleDrawer }) {
    const { userObject, logout } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [avatarError, setAvatarError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            if (userObject?.userId) {
                try {
                    const notifications = await getUnreadNotifications(userObject.userId);
                    setNotifications(notifications);
                    setUnreadCount(notifications.length);
                } catch (error) {
                    console.error('Failed to fetch notifications:', error);
                }
            }
        };

        fetchNotifications();
    }, [userObject]);

    const handleLogout = () => {
        logout();
    };

    const handleProfileClick = () => {
        navigate(`/profile`);
    };

    const handleHomeWalkClick = () => {
        navigate(`/dashboard`);
    };

    const handleNotificationClick = (event) => {
        if (unreadCount > 0) {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleNotificationClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationItemClick = async (notificationId) => {
        try {
            await markNotificationAsRead(notificationId);

            setNotifications((prevNotifications) =>
                prevNotifications.filter(notification => notification.notificationId !== notificationId)
            );
            setUnreadCount((prevCount) => prevCount - 1);
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        } finally {
            handleNotificationClose();
        }
    };

    const handleAvatarError = () => {
        setAvatarError(true);
    };

    return (
        <AppBar position="absolute" open={open}>
            <Toolbar sx={{ pr: '24px' }}>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleDrawer}
                    sx={{
                        marginRight: '36px',
                        ...(open && { display: 'none' }),
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={handleHomeWalkClick} >
                    HomeWalk
                </Typography>
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ 'aria-label': 'search' }}
                    />
                </Search>
                <IconButton color="inherit" onClick={handleNotificationClick}>
                    <Badge badgeContent={unreadCount} color="secondary">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleNotificationClose}
                >
                    {notifications.map((notification) => (
                        <MenuItem key={notification.notificationId} onClick={() => handleNotificationItemClick(notification.notificationId)}>
                            <ListItemText primary={notification.message} />
                        </MenuItem>
                    ))}
                </Menu>
                <IconButton color="inherit" onClick={handleProfileClick}>
                    {!avatarError && userObject?.avatarCustomization ? (
                        <img
                            src={userObject.avatarCustomization}
                            alt="User Avatar"
                            onError={handleAvatarError} // 이미지 로드 실패 시 처리
                            style={{ width: 30, height: 30, borderRadius: '50%' }}
                        />
                    ) : (
                        <AccountCircleIcon sx={{ fontSize: 30 }} />
                    )}
                </IconButton>
                <IconButton color="inherit" onClick={handleLogout}>
                    <LogoutIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}
