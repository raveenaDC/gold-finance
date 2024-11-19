import React, { useState } from 'react';
import { AppBar as MuiAppBar, Toolbar, IconButton, Button, Box, Typography, CssBaseline, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';

const drawerWidth = 240;

// Styled AppBar
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

export default function Navbar({ handleDrawerOpen, open }) {
    const [anchorElReports, setAnchorElReports] = useState(null);
    const [anchorElUtilities, setAnchorElUtilities] = useState(null);

    const handleReportsClick = (event) => {
        setAnchorElReports(event.currentTarget);
    };

    const handleUtilitiesClick = (event) => {
        setAnchorElUtilities(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorElReports(null);
        setAnchorElUtilities(null);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{ mr: 2, ...(open && { display: 'none' }) }} // Hide when drawer is open
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            Company Name
                        </Typography>
                    </Box>

                    {/* Align items to the right */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button color="inherit" sx={{ mr: 2 }}>Login Details</Button>
                        <Button color="inherit" sx={{ mr: 2 }}>Members</Button>

                        {/* Material UI Dropdown for Reports */}
                        <Button
                            color="inherit"
                            onClick={handleReportsClick}
                            sx={{ mr: 2 }}
                        >
                            Report
                        </Button>
                        <Menu
                            anchorEl={anchorElReports}
                            open={Boolean(anchorElReports)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>Action</MenuItem>
                            <MenuItem onClick={handleClose}>Another Action</MenuItem>
                            <MenuItem onClick={handleClose}>Something Else</MenuItem>
                        </Menu>

                        {/* Material UI Dropdown for Utilities */}
                        <Button
                            color="inherit"
                            onClick={handleUtilitiesClick}
                            sx={{ mr: 2 }}
                        >
                            Utilities
                        </Button>
                        <Menu
                            anchorEl={anchorElUtilities}
                            open={Boolean(anchorElUtilities)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>Action</MenuItem>
                            <MenuItem onClick={handleClose}>Another Action</MenuItem>
                            <MenuItem onClick={handleClose}>Something Else</MenuItem>
                        </Menu>

                        <Button color="inherit">Logout</Button>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
