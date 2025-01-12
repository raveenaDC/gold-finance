import { styled, useTheme } from '@mui/material/styles';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import { ROUTES } from '../../constant/route';
import { getFromLS } from '../../utils/storage.utils';
import { STORAGE_KEYS } from '../../config/app.config';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: open ? 0 : `-${drawerWidth}px`,
    marginTop: '32px'
}));

const AuthLayout = () => {
    const theme = useTheme();

    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const token = getFromLS(STORAGE_KEYS.TOKEN);

    const isUserLoggedIn = !!token; // todo - access token from store and set login status



    return (

        isUserLoggedIn ? (

            <>
                <Navbar handleDrawerOpen={handleDrawerOpen} open={open} />
                <Sidebar open={open} handleDrawerClose={handleDrawerClose} theme={theme} drawerWidth={drawerWidth} />
                <Main open={open}>
                    <Outlet />
                </Main>
            </>
        ) : (
            <Navigate to={ROUTES.LOGIN} replace />
        )
    )
}

export default AuthLayout