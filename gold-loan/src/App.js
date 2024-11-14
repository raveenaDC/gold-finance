// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material'; // Keep 'Box' and 'CssBaseline' as they are used
import { styled, useTheme } from '@mui/material/styles';
import Navbar from './Dashboard/Navbar';
import DrawerLeft from './Dashboard/DrawerLeft';
import MainPage from './Dashboard/MainPage';
import GlMaster from './Forms/GlMaster';
import Typography from '@mui/material/Typography';
import GoldLoanForm from './Forms/GoldLoanForm';
import { NomineeProvider } from './Forms/NomineeContext';





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

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Router>
      <NomineeProvider>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <Navbar handleDrawerOpen={handleDrawerOpen} open={open} />
          <DrawerLeft open={open} handleDrawerClose={handleDrawerClose} theme={theme} drawerWidth={drawerWidth} />
          <Main open={open}>
            <Typography sx={{ marginTop: 6, }}>

              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/gl-master" element={<GlMaster />} />
                <Route path="/gold-loan/:customerId" element={<GoldLoanForm />} />

                {/* <Route path="/goldloan-form/:customerId/:id" element={<GoldLoanForm />} /> Add the nomineeId param */}
              </Routes>
            </Typography>
          </Main>
        </Box>
      </NomineeProvider>
    </Router>
  );
}