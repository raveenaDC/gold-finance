import React, { useState, useEffect } from 'react';
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
import { viewReports } from "../services/system/system.service";

function GlCustomerDetails() {
    const [searchFirstName, setSearchFirstName] = useState('');
    const [searchSecondName, setSearchSecondName] = useState('');
    const [searchAddress, setSearchAddress] = useState('');
    const [searchPhoneOrEmail, setSearchPhoneOrEmail] = useState('');

    const [filteredClosedData, setFilteredClosedData] = useState([]);
    const [filteredNonClosedData, setFilteredNonClosedData] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [customerReports, setCustomerReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredData, setFilteredData] = useState([]);



    const fetchGlLedgerReport = async () => {
        try {
            const response = await viewReports();
            if (!response?.isSuccess) {
                alert(response.result);
                return;
            }
            console.log("response456", response);

            setCustomerReports(response.result.data.loanDetails);
            setFilteredData(response.result.data.loanDetails); // Initialize filteredData with all records
        } catch (error) {
            console.error("Error fetching GL Ledger Report:", error);
            alert("Failed to fetch GL Ledger Report. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGlLedgerReport();
    }, []);

    useEffect(() => {
        setFilteredClosedData(filteredData.filter((item) => item.isClosed));
        setFilteredNonClosedData(filteredData.filter((item) => !item.isClosed));
    }, [filteredData]); // Runs when filteredData updates


    const handleSearchSubmit = () => {
        const filteredData = customerReports.filter((item) => {
            const matchesFirstName = searchFirstName
                ? item.customerData?.firstName.toLowerCase().includes(searchFirstName.toLowerCase())
                : true;
            const matchesSecondName = searchSecondName
                ? item.customerData?.lastName.toLowerCase().includes(searchSecondName.toLowerCase())
                : true;
            const matchesAddress = searchAddress
                ? item.customerData?.address.toLowerCase().includes(searchAddress.toLowerCase())
                : true;
            const matchesPhoneOrEmail = searchPhoneOrEmail
                ? item.customerData?.primaryNumber.includes(searchPhoneOrEmail) ||
                item.customerData?.email.toLowerCase().includes(searchPhoneOrEmail.toLowerCase())
                : true;

            return (
                matchesFirstName && matchesSecondName && matchesAddress && matchesPhoneOrEmail
            );
        });

        // Split data into Closed and Non-Closed for tabs
        setFilteredClosedData(filteredData.filter((item) => item.isClosed));
        setFilteredNonClosedData(filteredData.filter((item) => !item.isClosed));
    };


    // Split data into Closed and Non-Closed for tabs


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
                                    <TableCell>{new Date(item.purchaseDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        {item.goldItemDetails.map((gold, index) => (
                                            <div key={index}>
                                                {gold.goldItem.name} (Net Weight: {gold.netWeight})
                                            </div>
                                        ))}
                                    </TableCell>
                                    <TableCell>{item.totalNetWeight}</TableCell>
                                    <TableCell>{item.principleAmount}</TableCell>
                                    <TableCell>{item.balanceAmount}</TableCell>
                                    <TableCell>{item.totalInterestRate}</TableCell>
                                    <TableCell>{new Date(item.lastTransactionDate).toLocaleDateString()}</TableCell>
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
                                    <TableCell>{new Date(item.purchaseDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        {item.goldItemDetails.map((gold, index) => (
                                            <div key={index}>
                                                {gold.goldItem.name} (Net Weight: {gold.netWeight})
                                            </div>
                                        ))}
                                    </TableCell>
                                    <TableCell>{item.totalNetWeight}</TableCell>
                                    <TableCell>{item.principleAmount}</TableCell>
                                    <TableCell>{item.balanceAmount}</TableCell>
                                    <TableCell>{item.totalInterestRate}</TableCell>
                                    <TableCell>{new Date(item.lastTransactionDate).toLocaleDateString()}</TableCell>
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