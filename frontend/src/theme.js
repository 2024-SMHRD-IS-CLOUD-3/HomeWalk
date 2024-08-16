import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#546E7A', // 청회색
            light: '#78909C',
            dark: '#37474F',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#26A69A', // 청록색
            light: '#4DB6AC',
            dark: '#00796B',
            contrastText: '#FFFFFF',
        },
        error: {
            main: '#EF5350', // 부드러운 빨간색
        },
        warning: {
            main: '#FFA726', // 부드러운 주황색
        },
        info: {
            main: '#29B6F6', // 밝은 파란색
        },
        success: {
            main: '#66BB6A', // 부드러운 녹색
        },
        background: {
            default: '#ECEFF1', // 매우 연한 청회색
            paper: '#FFFFFF',
        },
        text: {
            primary: '#37474F', // 진한 청회색
            secondary: '#78909C', // 중간 톤의 청회색
        },
        chart: {
            c1: '#26A69A', // 청록색 (secondary.main과 동일)
            c2: '#42A5F5', // 밝은 파란색
            c3: '#FFA726', // 부드러운 주황색 (warning.main과 동일)
            c4: '#66BB6A', // 부드러운 녹색 (success.main과 동일)
            c5: '#AB47BC', // 부드러운 보라색
            c6: '#EC407A', // 부드러운 분홍색
        },
    },
    typography: {
        fontFamily: 'GoormSansRegular, sans-serif',
        h1: {
            fontFamily: 'GoormSansBold',
            fontWeight: 700,
        },
        h2: {
            fontFamily: 'GoormSansBold',
            fontWeight: 700,
        },
        h3: {
            fontFamily: 'GoormSansBold',
            fontWeight: 700,
        },
        h4: {
            fontFamily: 'GoormSansMedium',
            fontWeight: 500,
        },
        h5: {
            fontFamily: 'GoormSansMedium',
            fontWeight: 500,
        },
        h6: {
            fontFamily: 'GoormSansMedium',
            fontWeight: 500,
        },
        subtitle1: {
            fontFamily: 'GoormSansMedium',
            fontWeight: 500,
        },
        subtitle2: {
            fontFamily: 'GoormSansMedium',
            fontWeight: 500,
        },
        body1: {
            fontFamily: 'GoormSansRegular',
            fontWeight: 400,
        },
        body2: {
            fontFamily: 'GoormSansRegular',
            fontWeight: 400,
        },
        button: {
            fontFamily: 'GoormSansMedium',
            fontWeight: 500,
            textTransform: 'none',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
                @font-face {
                    font-family: 'GoormSansBold';
                    src: url('./fonts/goorm-sans-bold.woff2') format('woff2'),
                         url('./fonts/goorm-sans-bold.woff') format('woff'),
                         url('./fonts/goorm-sans-bold.ttf') format('truetype');
                    font-weight: 700;
                    font-style: normal;
                }
                @font-face {
                    font-family: 'GoormSansMedium';
                    src: url('./fonts/goorm-sans-medium.woff2') format('woff2'),
                         url('./fonts/goorm-sans-medium.woff') format('woff'),
                         url('./fonts/goorm-sans-medium.ttf') format('truetype');
                    font-weight: 500;
                    font-style: normal;
                }
                @font-face {
                    font-family: 'GoormSansRegular';
                    src: url('./fonts/goorm-sans-regular.woff2') format('woff2'),
                         url('./fonts/goorm-sans-regular.woff') format('woff'),
                         url('./fonts/goorm-sans-regular.ttf') format('truetype');
                    font-weight: 400;
                    font-style: normal;
                }
                body {
                    font-family: 'GoormSansRegular', sans-serif;
                }
            `,
        },
    },
});

export default theme;