import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>
            AI 사주 분석
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="sm" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>
      <Box component="footer" sx={{ p: 3, mt: 'auto', backgroundColor: '#fafafa' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          본 서비스는 AI를 통해 제공되는 사주 분석 정보이며, 절대적인 해석이 아닌 참고 자료로 활용해 주시기 바랍니다.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          © {new Date().getFullYear()} AI Saju. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
