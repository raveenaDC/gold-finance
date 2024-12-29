import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { styled, useTheme, ThemeProvider } from '@mui/material/styles';
import { NomineeProvider } from './configure/NomineeContext';
import PageRoutes from './routes';
import appTheme from './theme/appTheme';
import { Sidebar, Navbar } from './components';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: open ? 0 : `-${drawerWidth}px`,
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function App() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Handle successful login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <ThemeProvider theme={appTheme}>
        <NomineeProvider>
          <Box sx={{ display: 'flex', mt: 4 }}>
            <CssBaseline />
            <Navbar handleDrawerOpen={handleDrawerOpen} open={open} />
            <Sidebar open={open} handleDrawerClose={handleDrawerClose} theme={theme} drawerWidth={drawerWidth} />
            <Main open={open}>
              <PageRoutes isAuthenticated={isAuthenticated} onLoginSuccess={handleLoginSuccess} />
            </Main>
          </Box>
        </NomineeProvider>
      </ThemeProvider>
    </Router>
  );
}
