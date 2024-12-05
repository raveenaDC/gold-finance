
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
import { ROUTES } from '../../constant/route';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

// Custom Drawer with scrollbar styling
const StyledDrawer = styled(Drawer)(({ theme }) => ({
    width: '100%',
    '& .MuiDrawer-paper': {
        width: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto', // Enable vertical scrolling
        // Scrollbar styling
        '&::-webkit-scrollbar': {
            width: '8px',
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: theme.palette.background.default,
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#757575',
            borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#616161',
        },
    },
}));


export default function Sidebar({ open, handleDrawerClose, theme, drawerWidth }) {
    return (
        <StyledDrawer
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
                    <ListItemButton component={Link} to={ROUTES.GOLD_LOAN}>
                        <ListItemIcon><AccountBoxSharpIcon /></ListItemIcon>
                        <ListItemText primary="GL Master" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton >
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
                {[{ text: 'GL Transaction', icon: <MonetizationOnIcon />, value: ROUTES.GOLD_TRANSACTION },
                { text: 'FR Transaction', icon: <SavingsIcon />, value: ROUTES.FIXED_TRANSACTION },
                { text: 'PL Transaction', icon: <SecurityIcon />, value: ROUTES.PLEDGED_TRANSACTION },
                ].map(({ text, icon, value }) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton component={Link} to={value}>
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
        </StyledDrawer>
    );
}
