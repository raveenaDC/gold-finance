import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    AppBar as MuiAppBar, Toolbar, IconButton, Button, Box, Typography, CssBaseline,
    Menu, MenuItem, useMediaQuery, useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { RateSetting, InterestPlanModal } from '../index';
import { ROUTES } from '../../constant/route';
import CustomerForm from '../../pages/Member';
import StaffModal from '../Add Member Role';
import Designation from '../Add Designation';
import Fee from '../Fee';

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

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if the screen is mobile

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        console.log("User logged out");
        setAnchorEl(null);
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
            <AppBar position="fixed" open={open} sx={{ backgroundColor: '#ffff', zIndex: theme.zIndex.drawer + 1 }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Left Section: Hamburger Menu and Company Name */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{
                                color: 'black', mr: 2, ...(open && { display: 'none' })
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            Company Name
                        </Typography>
                    </Box>

                    {/* Right Section: Buttons and Dropdowns */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* Login Details Button (Hidden on Mobile) */}
                        {!isMobile && (
                            <Button color="inherit" sx={{ mr: 2, color: 'black' }}>Login Details</Button>
                        )}

                        {/* Customer Form (Hidden on Mobile) */}
                        {!isMobile && <CustomerForm />}

                        {/* Reports Dropdown */}
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
                            <MenuItem onClick={handleClose}>GL Ledger Report</MenuItem>
                            <MenuItem onClick={handleClose} component={Link} to={ROUTES.GL_LEDGER_REPORT}>GL Schedule Report</MenuItem>
                            <MenuItem onClick={handleClose}>GL Ordinary Letter</MenuItem>
                            <MenuItem onClick={handleClose}>GL Registered Letter</MenuItem>
                            <MenuItem onClick={handleClose} component={Link} to={ROUTES.GL_Transaction_Report}>GL Transaction Report</MenuItem>
                            <MenuItem onClick={handleClose} component={Link} to={ROUTES.GL_Customer_Details}>Gl Customer Details</MenuItem>
                            <MenuItem onClick={handleClose}>GL Closed /Non-Closed Details</MenuItem>
                            <MenuItem onClick={handleClose}>GL Closed / Non-Closed Details</MenuItem>
                        </Menu>

                        {/* Utilities Dropdown */}
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
                            <MenuItem><RateSetting /></MenuItem>
                            <MenuItem><InterestPlanModal /></MenuItem>
                            <MenuItem onClick={handleClose}>GoldLoan Setting</MenuItem>
                            <MenuItem onClick={handleClose}>Create Financial Year</MenuItem>
                            <MenuItem onClick={handleClose}>Set Financial Year</MenuItem>
                            <MenuItem onClick={handleClose}>Print Setup</MenuItem>
                            <MenuItem onClick={handleClose}>User Setting</MenuItem>
                            <MenuItem onClick={handleClose}>Password</MenuItem>
                            <MenuItem><Fee /></MenuItem>
                            <MenuItem><Designation /></MenuItem>
                            <MenuItem><StaffModal /></MenuItem>
                        </Menu>

                        {/* Avatar and Dropdown Menu */}
                        <Avatar
                            sx={{ bgcolor: '#689689', cursor: 'pointer', marginRight: 1 }}
                        >
                            <AccountCircleIcon sx={{ color: 'black' }} onClick={handleMenuOpen} />
                        </Avatar>
                        <IconButton onClick={handleMenuOpen}>
                            <ArrowDropDownIcon sx={{ color: 'black' }} />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    marginTop: '64px', // Adjust margin to account for the AppBar height
                    width: `calc(100% - ${open ? drawerWidth : 0}px)`, // Adjust width when drawer is open
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    ...(open && {
                        marginLeft: `${drawerWidth}px`,
                        width: `calc(100% - ${drawerWidth}px)`,
                        transition: theme.transitions.create(['width', 'margin'], {
                            easing: theme.transitions.easing.easeOut,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    }),
                }}
            >
                {/* Render your page content here */}
                {/* Example: <YourPageComponent /> */}
            </Box>
        </Box>
    );
}