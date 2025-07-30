import React, { useState } from 'react';
import {
    Box, Button, Grid, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow,
    TextField, Typography
} from '@mui/material';

const DayBook = () => {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [data, setData] = useState([]);

    const handleSearch = () => {
        // 🔄 Mocked data — replace with real API fetch if needed
        const mockData = [
            {
                date: '2025-06-10',
                type: 'Received',
                no: 'RCPT001',
                accountName: 'Customer A',
                credit: 5000,
                debit: 0,
            },
            {
                date: '2025-06-11',
                type: 'Payment',
                no: 'VCHR001',
                accountName: 'Vendor B',
                credit: 0,
                debit: 2000,
            },
        ];
        setData(mockData); // optionally filter using fromDate and toDate
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" align="center" gutterBottom>
                Day Book
            </Typography>

            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                    <TextField
                        label="From Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        size='small'
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        label="To Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        size='small'
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button variant="contained" onClick={handleSearch} size='small'>
                        Search
                    </Button>
                </Grid>
            </Grid>


            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Date</strong></TableCell>
                            <TableCell><strong>Type</strong></TableCell>
                            <TableCell><strong>No</strong></TableCell>
                            <TableCell><strong>Account Name</strong></TableCell>
                            <TableCell><strong>Credit</strong></TableCell>
                            <TableCell><strong>Debit</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">No data</TableCell>
                            </TableRow>
                        ) : (
                            data.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>{row.type}</TableCell>
                                    <TableCell>{row.no}</TableCell>
                                    <TableCell>{row.accountName}</TableCell>
                                    <TableCell>{row.credit !== 0 ? row.credit : '-'}</TableCell>
                                    <TableCell>{row.debit !== 0 ? row.debit : '-'}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default DayBook;
