import React, { useState } from 'react';
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

// Mock Data for demonstration purposes
const mockData = [
    {
        glNo: '001',
        date: '2023-12-01',
        fullName: 'John Paul',
        amount: 10000,
        intPlan: 'Plan A',
        days: 30,
        txnDate: '2023-12-15',
        paidAmount: 5000,
        intPaid: 200,
        intPaidDate: '2023-12-10',
        intToPay: 300,
    },
    {
        glNo: '002',
        date: '2023-12-01',
        fullName: 'Sachin tend',
        amount: 20000,
        intPlan: 'Plan B',
        days: 25,
        txnDate: '2023-12-15',
        paidAmount: 10000,
        intPaid: 400,
        intPaidDate: '2023-12-11',
        intToPay: 600,
    },
];

function GlLedgerReport() {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [asOnDate, setAsOnDate] = useState('');
    const [viewType, setViewType] = useState('Summary');

    const handleSubmit = () => {
        alert('Results fetched based on the date range');
    };

    const handleViewChange = (type) => {
        setViewType(type);
    };

    return (
        <Box sx={styles.container}>
            {/* Title Section */}
            <Typography variant="body2" gutterBottom>
                GL LEDGER REPORT
            </Typography>

            {/* Date Selectors */}
            <Grid container spacing={2} sx={styles.dateSelector}>
                <Grid item xs={12} sm={2}>
                    <TextField
                        fullWidth
                        label="From Date"
                        type="date"
                        value={fromDate}
                        size='small'
                        onChange={(e) => setFromDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <TextField
                        fullWidth
                        label="To Date"
                        type="date"
                        size='small'
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <TextField
                        fullWidth
                        label="As On Date"
                        type="date"
                        value={asOnDate}
                        size='small'
                        onChange={(e) => setAsOnDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12} sm={1}>
                    <Button variant="contained" color="primary" sx={styles.submitButton} onClick={handleSubmit}>
                        Submit
                    </Button>
                </Grid>
                <Grid item >
                    {/* View Options */}
                    <Grid container spacing={2} sx={styles.buttonGroup}>
                        <Grid item xs={12} sm={6}>
                            <Button
                                variant={viewType === 'Detailed' ? 'contained' : 'outlined'}
                                color="secondary"
                                onClick={() => handleViewChange('Detailed')}
                            >
                                Detailed
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button
                                variant={viewType === 'Summary' ? 'contained' : 'outlined'}
                                color="secondary"
                                onClick={() => handleViewChange('Summary')}
                            >
                                Summary
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>

            {/* Submit Button */}



            {/* Render Table */}
            {viewType === 'Summary' ? <SummaryView /> : <DetailedView />}
        </Box>
    );
}

// Summary View Section
const SummaryView = () => {
    return (
        <Box sx={styles.tableContainer}>
            <Typography variant="h6" gutterBottom>
                Summary View
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {['GL No', 'Date', 'Full Name', 'Amount', 'Int Plan', 'Days', 'Paid Amount', 'Int Paid', 'Int To Pay'].map(
                                (header) => (
                                    <TableCell key={header}>{header}</TableCell>
                                )
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mockData.map((item) => (
                            <TableRow key={item.glNo}>
                                <TableCell>{item.glNo}</TableCell>
                                <TableCell>{item.date}</TableCell>
                                <TableCell>{item.fullName}</TableCell>
                                <TableCell>{item.amount}</TableCell>
                                <TableCell>{item.intPlan}</TableCell>
                                <TableCell>{item.days}</TableCell>
                                <TableCell>{item.paidAmount}</TableCell>
                                <TableCell>{item.intPaid}</TableCell>
                                <TableCell>{item.intToPay}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

// Detailed View Section
const DetailedView = () => {
    return (
        <Box sx={styles.tableContainer}>
            <Typography variant="h6" gutterBottom>
                Detailed View
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {[
                                'GL No',
                                'Date',
                                'Full Name',
                                'Amount',
                                'Int Plan',
                                'Days',
                                'Txn Date',
                                'Paid Amount',
                                'Int Paid',
                                'Int Paid Date',
                                'Int To Pay',
                            ].map((header) => (
                                <TableCell key={header}>{header}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mockData.map((item) => (
                            <TableRow key={item.glNo}>
                                <TableCell>{item.glNo}</TableCell>
                                <TableCell>{item.date}</TableCell>
                                <TableCell>{item.fullName}</TableCell>
                                <TableCell>{item.amount}</TableCell>
                                <TableCell>{item.intPlan}</TableCell>
                                <TableCell>{item.days}</TableCell>
                                <TableCell>{item.txnDate}</TableCell>
                                <TableCell>{item.paidAmount}</TableCell>
                                <TableCell>{item.intPaid}</TableCell>
                                <TableCell>{item.intPaidDate}</TableCell>
                                <TableCell>{item.intToPay}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

// Styles
const styles = {
    container: {
        padding: '20px',
    },
    dateSelector: {
        marginBottom: '15px',
    },
    submitButton: {
        marginBottom: '20px',
    },
    buttonGroup: {
        marginBottom: '20px',
    },
    tableContainer: {
        marginTop: '20px',
        padding: '10px',
    },
};

export default GlLedgerReport;
