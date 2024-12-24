import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar as MuiAppBar, Toolbar, IconButton, Button, Box, Typography, CssBaseline, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { RateSetting, InterestPlanModal } from '../index';
import { ROUTES } from '../../constant/route';


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
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        // Implement logout logic here
        console.log("User logged out");
        setAnchorEl(null); // Close menu after logout
    };

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
            <AppBar position="fixed" open={open} sx={{ backgroundColor: '#ffff ' }}  >
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{
                                color: 'black', mr: 2, ...(open && { display: 'none' })
                            }} // Hide when drawer is open
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            Company Name
                        </Typography>
                    </Box>

                    {/* Align items to the right */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button color="inherit" sx={{ mr: 2, color: 'black' }}>Login Details</Button>
                        <Button color="inherit" sx={{ mr: 2, color: 'black' }}>Members</Button>

                        {/* Material UI Dropdown for Reports */}
                        <Button
                            color="inherit"
                            onClick={handleReportsClick}
                            sx={{ mr: 2, color: 'black' }}
                        >
                            Report
                        </Button>
                        <Menu
                            anchorEl={anchorElReports}
                            open={Boolean(anchorElReports)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose} >GL Ledger Report </MenuItem>
                            <MenuItem onClick={handleClose} component={Link} to={ROUTES.GL_LEDGER_REPORT}>GL Schedule Report </MenuItem>
                            <MenuItem onClick={handleClose}>GL Ordinary Letter  </MenuItem>
                            <MenuItem onClick={handleClose}>GL Registered Letter </MenuItem>
                            <MenuItem onClick={handleClose} component={Link} to={ROUTES.GL_Transaction_Report}>GL Transaction Report </MenuItem>
                            <MenuItem onClick={handleClose} component={Link} to={ROUTES.GL_Customer_Details} >Gl Customer Details</MenuItem>
                            <MenuItem onClick={handleClose}>GL Closed /Non-Closed Details </MenuItem>
                            <MenuItem onClick={handleClose}>GL Closed / Non-Closed Details </MenuItem>


                        </Menu>

                        {/* Material UI Dropdown for Utilities */}
                        <Button
                            color="inherit"
                            onClick={handleUtilitiesClick}
                            sx={{ mr: 2, color: 'black' }}
                        >
                            SYSTEM
                        </Button>
                        <Menu
                            anchorEl={anchorElUtilities}
                            open={Boolean(anchorElUtilities)}
                            onClose={handleClose}
                        >
                            <MenuItem ><RateSetting /></MenuItem>
                            <MenuItem > <InterestPlanModal /></MenuItem>
                            <MenuItem onClick={handleClose}>Create Financial Year</MenuItem>
                            <MenuItem onClick={handleClose}>Set Financial Year</MenuItem>
                            <MenuItem onClick={handleClose}>Print Setup</MenuItem>
                            <MenuItem onClick={handleClose}>User Setting</MenuItem>
                            <MenuItem onClick={handleClose}>Password </MenuItem>

                        </Menu>



                        <Avatar
                            sx={{ bgcolor: '#689689', cursor: 'pointer', marginRight: 1 }}
                        >
                            <AccountCircleIcon sx={{ color: 'black' }} onClick={handleMenuOpen} /> {/* User icon */}
                        </Avatar>

                        {/* Down arrow to trigger menu */}
                        <IconButton onClick={handleMenuOpen}>
                            <ArrowDropDownIcon sx={{ color: 'black' }} />
                        </IconButton>

                        {/* Dropdown Menu */}
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            {/* <MenuItem onClick={handleLogout}>Logout</MenuItem> */}
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            {/* Add more menu items if needed */}
                        </Menu>


                    </Box>
                </Toolbar>
            </AppBar>
        </Box >
    );
}
