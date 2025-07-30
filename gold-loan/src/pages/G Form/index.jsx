import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Select,
    MenuItem,
    TextField,
    Button,
    Grid,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableContainer,
    useMediaQuery,
    useTheme
} from '@mui/material';

const GFormModal = () => {
    const [open, setOpen] = useState(false);
    const [quarter, setQuarter] = useState('Q1');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [submittedData, setSubmittedData] = useState(null);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

    const getQuarterDates = (quarter) => {
        const year = new Date().getFullYear();
        switch (quarter) {
            case 'Q1':
                return [`${year}-01-01`, `${year}-03-31`];
            case 'Q2':
                return [`${year}-04-01`, `${year}-06-30`];
            case 'Q3':
                return [`${year}-07-01`, `${year}-09-30`];
            case 'Q4':
                return [`${year}-10-01`, `${year}-12-31`];
            default:
                return ['', ''];
        }
    };

    useEffect(() => {
        const [start, end] = getQuarterDates(quarter);
        setFromDate(start);
        setToDate(end);
    }, [quarter]);

    const handleSubmit = () => {
        setSubmittedData({
            quarter,
            fromDate,
            toDate,
            amount: '₹10,000',
            totalOpen: '5',
            issuedAmount: '₹8,000',
            totalClosed: '3',
            openingBalance: '₹15,000',
            closingBalance: '₹12,000',
            totalInterest: '₹500'
        });
    };

    const handleClose = () => {
        setOpen(false);
        setSubmittedData(null);
    };

    return (
        <div>
            <Typography variant="contained" onClick={() => setOpen(true)}>
                G Form
            </Typography>

            <Modal
                open={open}
                onClose={handleClose}
                sx={{
                    overflowY: 'auto',
                    display: 'flex',
                    alignItems: isSmallScreen ? 'flex-start' : 'center',
                    justifyContent: 'center',
                    p: isSmallScreen ? 2 : 0
                }}
            >
                <Box
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        width: isSmallScreen ? '100%' : isMediumScreen ? '90%' : 800,
                        maxWidth: '100%',
                        mx: 'auto',
                        my: isSmallScreen ? 2 : 10,
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}
                >
                    <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                        G FORM DETAILS
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={submittedData ? 7 : 12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Select
                                        fullWidth
                                        value={quarter}
                                        onChange={(e) => setQuarter(e.target.value)}
                                        size='small'
                                        label="Quarter"
                                    >
                                        <MenuItem value="Q1">First Quarter (Q1)</MenuItem>
                                        <MenuItem value="Q2">Second Quarter (Q2)</MenuItem>
                                        <MenuItem value="Q3">Third Quarter (Q3)</MenuItem>
                                        <MenuItem value="Q4">Fourth Quarter (Q4)</MenuItem>
                                    </Select>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="From Date"
                                        value={fromDate}
                                        InputProps={{ readOnly: true }}
                                        size='small'
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="To Date"
                                        value={toDate}
                                        InputProps={{ readOnly: true }}
                                        size='small'
                                    />
                                </Grid>

                                <Grid item xs={4}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={handleSubmit}
                                        sx={{ mt: 1 }}
                                    >
                                        Submit
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>

                        {submittedData && (
                            <Grid item xs={12} md={5}>
                                <Paper sx={{ padding: 2, height: '100%', }}>
                                    <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
                                        G FORM DATA
                                    </Typography>

                                    <TableContainer component={Paper} elevation={3} sx={{ mb: 2 }}>
                                        <Table size="small">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell><strong>Quarter</strong></TableCell>
                                                    <TableCell>{submittedData.quarter}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>From Date</strong></TableCell>
                                                    <TableCell>{submittedData.fromDate}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>To Date</strong></TableCell>
                                                    <TableCell>{submittedData.toDate}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    <Box sx={{ mt: 2 }}>
                                        {[
                                            { label: 'Date', value: submittedData.amount },
                                            { label: 'Amount', value: submittedData.amount },
                                            { label: 'Total Open', value: submittedData.totalOpen },
                                            { label: 'Issued Amount', value: submittedData.issuedAmount },
                                            { label: 'Total Closed', value: submittedData.totalClosed },
                                            { label: 'Opening Balance', value: submittedData.openingBalance },
                                            { label: 'Closing Balance', value: submittedData.closingBalance },
                                            { label: 'Total Interest', value: submittedData.totalInterest }
                                        ].map((item, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    p: 1,
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    // alignItems: 'center',
                                                    py: 1,
                                                    backgroundColor: index % 2 === 0 ? 'action.hover' : 'background.paper',
                                                    // borderBottom: index < 6 ? '1px solid rgba(0,0,0,0.12)' : 'none'
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                    {item.label}
                                                </Typography>
                                                <Typography variant="body2">
                                                    {item.value}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            onClick={handleClose}
                            sx={{ mr: 1 }}
                        >
                            Close
                        </Button>
                        {/* {submittedData && (
                            <Button variant="contained" color="primary">
                                Save
                            </Button>
                        )} */}
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default GFormModal;