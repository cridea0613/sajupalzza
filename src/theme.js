
import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
  },
  typography: {
    // 본문 기본 폰트를 '나눔스퀘어 네오'로 설정합니다.
    fontFamily: ['"Nanum Square Neo"', 'sans-serif'].join(','),
    // 제목 폰트는 '고운바탕'을 유지합니다.
    h1: {
      fontFamily: 'Gowun Batang, serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'Gowun Batang, serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: 'Gowun Batang, serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: 'Gowun Batang, serif',
      fontWeight: 700,
      fontSize: '2.2rem',
      lineHeight: 1.2,
    },
    h5: {
      fontFamily: 'Gowun Batang, serif',
      fontWeight: 600,
      fontSize: '1.8rem',
      lineHeight: 1.3,
    },
    h6: {
      fontFamily: 'Gowun Batang, serif',
      fontWeight: 600,
    },
    // 본문 텍스트 스타일 정의
    body1: {
      fontFamily: '"Nanum Square Neo", sans-serif',
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: '"Nanum Square Neo", sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#333',
          boxShadow: '0 2px 4px -1px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

export default theme;
