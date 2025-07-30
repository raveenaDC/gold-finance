import React, { useEffect, useState } from 'react';
import {
    Button,
    TextField,
    Grid,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
} from '@mui/material';

import { viewReports } from "../services/system/system.service";

// Mock Data
const mockData = [
    { glNo: '001', date: '2023-12-01', txnDate: '2023-12-15', fullName: 'John Doe', paidAmount: 5000, remittedAmount: 2000, interest: 200 },
    { glNo: '002', date: '2023-12-02', txnDate: '2023-12-16', fullName: 'Jane Doe', paidAmount: 10000, remittedAmount: 5000, interest: 400 },
    { glNo: '003', date: '2023-12-05', txnDate: '2023-12-18', fullName: 'Alice Smith', paidAmount: 7000, remittedAmount: 3000, interest: 300 },
    { glNo: '004', date: '2023-12-10', txnDate: '2023-12-20', fullName: 'Bob Brown', paidAmount: 8000, remittedAmount: 4000, interest: 250 },
];

function GlTransactionReport() {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [transactionData, setTransactionData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchGlLedgerReport = async () => {
        try {
            const response = await viewReports();
            console.log("response in transaction data", response);

            if (!response?.isSuccess) {
                alert(response.result);
                return;
            }
            setTransactionData(response.result.data.loanDetails);
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

    const handleSubmit = () => {
        if (!fromDate || !toDate) {
            alert('Please select both From Date and To Date');
            return;
        }

        // Filter data based on date range
        const filtered = mockData.filter((item) => {
            const itemDate = new Date(item.date);
            const startDate = new Date(fromDate);
            const endDate = new Date(toDate);
            return itemDate >= startDate && itemDate <= endDate;
        });

        setFilteredData(filtered);
    };

    return (
        <Box sx={styles.container}>
            {/* Title Section */}
            <Typography variant="body2" sx={styles.title}>
                Gold Loan Report
            </Typography><br />

            {/* Date Selectors */}
            <Grid container spacing={2} sx={styles.dateSelector}>
                <Grid item xs={12} sm={3} md={2}>
                    <TextField
                        fullWidth
                        type="date"
                        label="From Date"
                        value={fromDate}
                        size='small'
                        onChange={(e) => setFromDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12} sm={3} md={2}>
                    <TextField
                        fullWidth
                        type="date"
                        label="To Date"
                        value={toDate}
                        size='small'
                        onChange={(e) => setToDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12} sm={3} md={2} sx={{ mt: -1 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth

                        sx={styles.submitButton}
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </Grid>
            </Grid>

            {/* Table Section */}
            <TableContainer component={Paper} sx={styles.tableContainer}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>GL No</b></TableCell>
                            <TableCell><b>Date (Placed Date)</b></TableCell>
                            <TableCell><b>TXN Date</b></TableCell>
                            <TableCell><b>Full Name</b></TableCell>
                            <TableCell><b>Paid Amount</b></TableCell>
                            <TableCell><b>Remitted Amount</b></TableCell>
                            <TableCell><b>Interest</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactionData.length > 0 ? (
                            transactionData.map((item) => (
                                <TableRow key={item.glNo}>
                                    <TableCell>{item.glNo}</TableCell>
                                    <TableCell>{item.purchaseDate}</TableCell>
                                    <TableCell>{item.lastTransactionDate}</TableCell>
                                    <TableCell>{(item.customerData?.firstName || '') + ' ' + (item.customerData?.lastName || '')}</TableCell>

                                    <TableCell>{item.amountPaid_totalPrinciplePaid}</TableCell>
                                    <TableCell>{item.balanceAmount}</TableCell>
                                    <TableCell>{item.interestPaid}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No data to display. Select dates and click Submit.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

// Styles
const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px',
        fontWeight: 'bold',
    },
    dateSelector: {
        marginBottom: '20px',
    },
    submitButton: {
        height: '40px',
        marginTop: '8px',
    },
    tableContainer: {
        marginTop: '20px',
    },
};

export default GlTransactionReport;
