import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { NomineeProvider } from './configure/NomineeContext';
import PageRoutes from './routes';
import appTheme from './theme/appTheme';

export default function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);


  // Handle successful login

  return (
    <Router>
      <ThemeProvider theme={appTheme}>
        <NomineeProvider>
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <PageRoutes />
          </Box>
        </NomineeProvider>
      </ThemeProvider>
    </Router>
  );
}
