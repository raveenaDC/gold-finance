import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountBoxSharpIcon from '@mui/icons-material/AccountBoxSharp';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import CoPresentSharpIcon from '@mui/icons-material/CoPresentSharp';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SavingsIcon from '@mui/icons-material/Savings';
import SecurityIcon from '@mui/icons-material/Security';
import ReceiptIcon from '@mui/icons-material/Receipt'; // For GL, FR, and PL Transactions
import BarChartIcon from '@mui/icons-material/BarChart'; // For Chart of A/C
import PaymentIcon from '@mui/icons-material/Payment'; // For Payments
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // For Cheque Receipt
import DescriptionIcon from '@mui/icons-material/Description'; // For Journal
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import MainPage from './MainPage';

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

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function DrawerLeft() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
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
                            sx={{ mr: 2, ...(open && { display: '' }) }}
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
                        {/* Dropdown Menu */}
                        <Dropdown>
                            <Dropdown.Toggle variant="outline-none" id="dropdown-basic" sx={{ mr: 2 }} >
                                Report
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        {/* Dropdown Menu */}
                        <Dropdown>
                            <Dropdown.Toggle variant="outline-none" id="dropdown-basic" sx={{ mr: 2 }}>
                                Utilities
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        <Button color="inherit">Logout</Button>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <Avatar
                        alt="Remy Sharp"
                        src="/static/images/avatar/1.jpg"
                        sx={{
                            bgcolor: deepOrange[500],
                            width: { xs: 40, sm: 48, md: 56, lg: 64 },
                            height: { xs: 40, sm: 48, md: 56, lg: 64 },
                            mr: { xs: 2, sm: 4, md: 8, lg: 14 }
                        }}
                    />
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <CloseSharpIcon /> : <CloseSharpIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />

                {/* Masters Section */}
                <List>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/gl-master">
                            <ListItemIcon><AccountBoxSharpIcon /></ListItemIcon>
                            <ListItemText primary="GL Master" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/fr-master">
                            <ListItemIcon><AccountBoxTwoToneIcon /></ListItemIcon>
                            <ListItemText primary="FR Master" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/pl-master">
                            <ListItemIcon><CoPresentSharpIcon /></ListItemIcon>
                            <ListItemText primary="PL Master" />
                        </ListItemButton>
                    </ListItem>
                </List>

                <Divider />

                {/* Transactions Section */}
                <List>
                    {[{ text: 'GL Transaction', icon: <MonetizationOnIcon /> },
                    { text: 'FR Transaction', icon: <SavingsIcon /> },
                    { text: 'PL Transaction', icon: <SecurityIcon /> },
                    ].map(({ text, icon }) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>{icon}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <Divider />

                {/* Other Actions Section */}
                <List>
                    {[{ text: 'Chart Of A/C', icon: <BarChartIcon /> },
                    { text: 'Receipt', icon: <ReceiptIcon /> },
                    { text: 'Payment', icon: <PaymentIcon /> },
                    { text: 'Cheque Receipt', icon: <CheckCircleIcon /> },
                    { text: 'Cheque Payment', icon: <PaymentIcon /> },
                    { text: 'Journal', icon: <DescriptionIcon /> },
                    ].map(({ text, icon }) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>{icon}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <Divider />
            </Drawer>
            <Main open={open}>
                <div>
                    <DrawerHeader> welcome </DrawerHeader>
                    <Typography sx={{ marginBottom: 2 }}>
                        <BarChart
                            xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
                            series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
                            width={500}
                            height={300}
                        />
                    </Typography>
                    <Typography sx={{ marginBottom: 2 }}>
                        <LineChart
                            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                            series={[
                                {
                                    data: [2, 5.5, 2, 8.5, 1.5, 5],
                                },
                            ]}
                            width={500}
                            height={300}
                        />
                    </Typography>
                    <Typography sx={{ marginBottom: 2 }}>

                    </Typography>

                </div>


            </Main>
        </Box>
    );
}
