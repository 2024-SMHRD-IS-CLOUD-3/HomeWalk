import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#3f51b5', // 인디고 블루
            light: '#757de8',
            dark: '#002984',
        },
        secondary: {
            main: '#f50057', // 밝은 핑크
            light: '#ff5983',
            dark: '#bb002f',
        },
        error: {
            main: '#d32f2f',
        },
        warning: {
            main: '#ffa726',
        },
        info: {
            main: '#29b6f6',
        },
        success: {
            main: '#66bb6a',
        },
        background: {
            default: '#f4f5fd', // 매우 연한 블루 그레이
            paper: '#ffffff',
        },
        text: {
            primary: '#333333', // 거의 검정
            secondary: '#666666', // 진한 회색
        },
    },
    typography: {
        fontFamily: 'GmarketSans, sans-serif',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
        body {
          font-family: 'GmarketSans', sans-serif;
        }
      `,
        },
    },
});

export default theme;