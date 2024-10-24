// src/components/Sidebar.js
import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton, Avatar, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { deepOrange } from '@mui/material/colors';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccountBoxSharpIcon from '@mui/icons-material/AccountBoxSharp'; import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import CoPresentSharpIcon from '@mui/icons-material/CoPresentSharp';
import SavingsIcon from '@mui/icons-material/Savings';
import SecurityIcon from '@mui/icons-material/Security';
import BarChartIcon from '@mui/icons-material/BarChart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import { styled } from '@mui/material/styles';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));


export default function Sidebar({ open, handleDrawerClose, theme, drawerWidth }) {
    return (
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
    );
}
