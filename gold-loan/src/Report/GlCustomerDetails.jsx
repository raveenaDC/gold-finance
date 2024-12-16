import React, { useState } from 'react';
import {
    TextField,
    Button,
    Grid,
    Typography,
    Tabs,
    Tab,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';

const mockData = [
    {
        glNo: '001',
        date: '2023-12-01',
        name: 'John Doe',
        address: '123 Main St',
        phone: '1234567890',
        email: 'john.doe@example.com',
        itemsDetails: 'Gold Ring, 2',
        netWt: '50g',
        principalAmount: 5000,
        balanceAmount: 2000,
        interest: 150,
        lastTxnDate: '2023-12-15',
    },
    {
        glNo: '002',
        date: '2023-12-02',
        name: 'Jane Smith',
        address: '456 Oak St',
        phone: '0987654321',
        email: 'jane.smith@example.com',
        itemsDetails: 'Gold Chain, 1',
        netWt: '100g',
        principalAmount: 10000,
        balanceAmount: 5000,
        interest: 200,
        lastTxnDate: '2023-12-18',
    },
];

function GlCustomerDetails() {
    const [searchFirstName, setSearchFirstName] = useState('');
    const [searchSecondName, setSearchSecondName] = useState('');
    const [searchAddress, setSearchAddress] = useState('');
    const [searchPhoneOrEmail, setSearchPhoneOrEmail] = useState('');

    const [filteredClosedData, setFilteredClosedData] = useState([]);
    const [filteredNonClosedData, setFilteredNonClosedData] = useState([]);
    const [tabValue, setTabValue] = useState(0);

    const handleSearchSubmit = () => {
        const filteredData = mockData.filter((item) => {
            const matchesFirstName = searchFirstName
                ? item.name.toLowerCase().includes(searchFirstName.toLowerCase())
                : true;
            const matchesSecondName = searchSecondName
                ? item.name.toLowerCase().includes(searchSecondName.toLowerCase())
                : true;
            const matchesAddress = searchAddress
                ? item.address.toLowerCase().includes(searchAddress.toLowerCase())
                : true;
            const matchesPhoneOrEmail = searchPhoneOrEmail
                ? item.phone.includes(searchPhoneOrEmail) ||
                item.email.toLowerCase().includes(searchPhoneOrEmail.toLowerCase())
                : true;

            return (
                matchesFirstName && matchesSecondName && matchesAddress && matchesPhoneOrEmail
            );
        });

        // Split data into Closed and Non-Closed for tabs
        setFilteredClosedData(filteredData.slice(0, Math.ceil(filteredData.length / 2)));
        setFilteredNonClosedData(filteredData.slice(Math.ceil(filteredData.length / 2)));
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={{ padding: '20px' }}>
            {/* Search Section */}
            <Typography variant="h4" gutterBottom>
                Customer Search
            </Typography>

            <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
                <Grid item xs={6} sm={2.5}>
                    <TextField
                        fullWidth
                        label="First Name"
                        size='small'
                        value={searchFirstName}
                        onChange={(e) => setSearchFirstName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6} sm={2.5}>
                    <TextField
                        fullWidth
                        label="Second Name"
                        size='small'
                        value={searchSecondName}
                        onChange={(e) => setSearchSecondName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField
                        fullWidth
                        label="Address"
                        size='small'
                        value={searchAddress}
                        onChange={(e) => setSearchAddress(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6} sm={2.5}>
                    <TextField
                        fullWidth
                        label="Phone or Email"
                        size='small'
                        value={searchPhoneOrEmail}
                        onChange={(e) => setSearchPhoneOrEmail(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6} sm={1}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSearchSubmit}
                    >
                        Submit
                    </Button>
                </Grid>
            </Grid>

            {/* Tabs Section */}
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="Closed and Non-Closed">
                <Tab label="Closed" />
                <Tab label="Non-Closed" />
            </Tabs>

            {/* Tab Content */}
            <Box hidden={tabValue !== 0} sx={{ marginTop: '20px' }}>
                <Typography variant="h6">Closed Details</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>GL No</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Items Details</TableCell>
                                <TableCell>Net Wt</TableCell>
                                <TableCell>Principal Amount</TableCell>
                                <TableCell>Balance Amount</TableCell>
                                <TableCell>Interest</TableCell>
                                <TableCell>Last Transaction Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredClosedData.map((item) => (
                                <TableRow key={item.glNo}>
                                    <TableCell>{item.glNo}</TableCell>
                                    <TableCell>{item.date}</TableCell>
                                    <TableCell>{item.itemsDetails}</TableCell>
                                    <TableCell>{item.netWt}</TableCell>
                                    <TableCell>{item.principalAmount}</TableCell>
                                    <TableCell>{item.balanceAmount}</TableCell>
                                    <TableCell>{item.interest}</TableCell>
                                    <TableCell>{item.lastTxnDate}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box hidden={tabValue !== 1} sx={{ marginTop: '20px' }}>
                <Typography variant="h6">Non-Closed Details</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>GL No</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Items Details</TableCell>
                                <TableCell>Net Wt</TableCell>
                                <TableCell>Principal Amount</TableCell>
                                <TableCell>Balance Amount</TableCell>
                                <TableCell>Interest</TableCell>
                                <TableCell>Last Transaction Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredNonClosedData.map((item) => (
                                <TableRow key={item.glNo}>
                                    <TableCell>{item.glNo}</TableCell>
                                    <TableCell>{item.date}</TableCell>
                                    <TableCell>{item.itemsDetails}</TableCell>
                                    <TableCell>{item.netWt}</TableCell>
                                    <TableCell>{item.principalAmount}</TableCell>
                                    <TableCell>{item.balanceAmount}</TableCell>
                                    <TableCell>{item.interest}</TableCell>
                                    <TableCell>{item.lastTxnDate}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}

export default GlCustomerDetails;