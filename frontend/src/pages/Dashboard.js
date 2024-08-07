import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DirectionsWalk, TrendingUp, Update } from '@mui/icons-material';
import { Card, CardContent, CardHeader, Avatar, LinearProgress, ListItem, Checkbox } from '@mui/material';

const drawerWidth = 240;

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

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
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const defaultTheme = createTheme();

const weeklyData = [
  { day: '월', steps: 8000 },
  { day: '화', steps: 6000 },
  { day: '수', steps: 7000 },
  { day: '목', steps: 6500 },
  { day: '금', steps: 9000 },
  { day: '토', steps: 7500 },
  { day: '일', steps: 10000 },
];

const familyGoalData = [
  { name: '김관웅', goal: 10000, current: 7000 },
  { name: '임현진', goal: 9000, current: 6000 },
  { name: '배지환', goal: 8000, current: 5000 },
  { name: '박규민', goal: 7000, current: 4000 },
];

const familyWeeklyGoalData = [
  { name: '우리 가족', achievement: 85 }
];

const challenges = [
  { id: 1, text: '중앙 호수공원 만보 걷기' },
  { id: 2, text: '매일 아침 걷기' },
  { id: 3, text: '운전저수지에서 플로깅' },
];

export default function Dashboard() {
  const [open, setOpen] = React.useState(true);
  const [checked, setChecked] = React.useState([]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
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
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
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
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit">
              <AccountCircleIcon />
            </IconButton>
            <IconButton color="inherit">
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
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
            <ListItemButton>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="활동" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="목표" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="커뮤니티" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary="챌린지(도전)" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <LayersIcon />
              </ListItemIcon>
              <ListItemText primary="가족관리" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <LayersIcon />
              </ListItemIcon>
              <ListItemText primary="자세인식" />
            </ListItemButton>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Top Metrics */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: 'primary.dark' }}>
                          <DirectionsWalk />
                        </Avatar>
                      }
                      title="김관웅"
                      titleTypographyProps={{ variant: 'h6' }}
                    />
                    <CardContent>
                      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                        10,000
                      </Typography>
                      <Typography variant="subtitle1">걸음</Typography>
                      <LinearProgress variant="determinate" value={100} sx={{ my: 1, height: 10, borderRadius: 5 }} />
                      <Typography sx={{ mt: 1, display: 'flex', alignItems: 'center' }} variant="body2">
                        <TrendingUp sx={{ mr: 1 }} fontSize="small" />
                        어제보다 2,000 걸음 많음
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: 'secondary.dark' }}>
                          <DirectionsWalk />
                        </Avatar>
                      }
                      title="임현진"
                      titleTypographyProps={{ variant: 'h6' }}
                    />
                    <CardContent>
                      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                        9,000
                      </Typography>
                      <Typography variant="subtitle1">걸음</Typography>
                      <LinearProgress variant="determinate" value={90} sx={{ my: 1, height: 10, borderRadius: 5 }} />
                      <Typography sx={{ mt: 1, display: 'flex', alignItems: 'center' }} variant="body2">
                        <TrendingUp sx={{ mr: 1 }} fontSize="small" />
                        어제보다 3% 증가
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: 'success.dark' }}>
                          <DirectionsWalk />
                        </Avatar>
                      }
                      title="배지환"
                      titleTypographyProps={{ variant: 'h6' }}
                    />
                    <CardContent>
                      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                        8,000
                      </Typography>
                      <Typography variant="subtitle1">걸음</Typography>
                      <LinearProgress variant="determinate" value={80} sx={{ my: 1, height: 10, borderRadius: 5 }} />
                      <Typography sx={{ mt: 1, display: 'flex', alignItems: 'center' }} variant="body2">
                        <TrendingUp sx={{ mr: 1 }} fontSize="small" />
                        어제보다 1% 증가
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: 'warning.dark' }}>
                          <DirectionsWalk />
                        </Avatar>
                      }
                      title="박규민"
                      titleTypographyProps={{ variant: 'h6' }}
                    />
                    <CardContent>
                      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                        7,000
                      </Typography>
                      <Typography variant="subtitle1">걸음</Typography>
                      <LinearProgress variant="determinate" value={70} sx={{ my: 1, height: 10, borderRadius: 5 }} />
                      <Typography sx={{ mt: 1, display: 'flex', alignItems: 'center' }} variant="body2">
                        <Update sx={{ mr: 1 }} fontSize="small" />
                        최근 업데이트
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              {/* Family Goal Comparison Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 300,
                  }}
                >
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    가족 목표 달성 비교
                  </Typography>
                  <ResponsiveContainer>
                    <BarChart
                      data={familyGoalData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="goal" fill="#8884d8" name="목표 걸음 수" />
                      <Bar dataKey="current" fill="#82ca9d" name="현재 걸음 수" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              {/* Weekly Progress */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 300,
                  }}
                >
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    주간 진행 상황
                  </Typography>
                  <ResponsiveContainer>
                    <LineChart data={weeklyData}>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="steps" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              {/* August Ranking */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    8월 랭킹
                  </Typography>
                  <Typography component="p" variant="body1">1. 관웅Fam: 50,000 걸음</Typography>
                  <Typography component="p" variant="body1">2. 현진Fam: 33,000 걸음</Typography>
                  <Typography component="p" variant="body1">3. 지환Fam: 30,000 걸음 (100% 달성)</Typography>
                </Paper>
              </Grid>
              {/* Family Weekly Steps (주간 걸음) */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    우리 가족 통합목표 달성률
                  </Typography>
                  <ResponsiveContainer>
                    <BarChart
                      data={familyWeeklyGoalData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="achievement" fill="#8884d8" name="달성률" />
                    </BarChart>
                  </ResponsiveContainer>
                  <Typography variant="h4" color="primary" align="center">
                    {familyWeeklyGoalData[0].achievement}%
                  </Typography>
                  <Typography color="text.secondary" align="center">
                    가족 공동 목표 달성률
                  </Typography>
                </Paper>
              </Grid>
              {/* Challenge List */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    챌린지 목록
                  </Typography>
                  <List>
                    {challenges.map((challenge) => (
                      <ListItem key={challenge.id} disablePadding>
                        <ListItemButton role={undefined} onClick={handleToggle(challenge.id)} dense>
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={checked.indexOf(challenge.id) !== -1}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ 'aria-labelledby': `checkbox-list-label-${challenge.id}` }}
                            />
                          </ListItemIcon>
                          <ListItemText id={`checkbox-list-label-${challenge.id}`} primary={challenge.text} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
