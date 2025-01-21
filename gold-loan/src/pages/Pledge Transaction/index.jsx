import React, { useState } from 'react';
import {
    Box, Grid, Paper, Typography, TextField, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button, Autocomplete
} from '@mui/material';
import SearchModal from '../../components/Pledge details';

export default function PledgeTransaction() {
    const [formData, setFormData] = useState({
        paidAmount: '',
        paidPrincipal: '',
        paidInterest: '',
        paidOtherCharges: '',
        remarks: '',
        pledgeNumber: null,
    });

    const pledgeNumberOptions = [
        { label: 'Pledge 001', id: '1' },
        { label: 'Pledge 002', id: '2' },
        { label: 'Pledge 003', id: '3' },
    ];

    const pledges = [
        {
            pledgeId: 1,
            bankName: 'Bank A',
            principalAmount: '50000',
            interestRate: '5%',
            otherCharges: '500',
            dueDate: '2025-12-31',
            loanDuration: '12 months',
            itemDetails: 'Gold Necklace'
        }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <Box sx={{ padding: '16px' }}>
            <Grid container spacing={2}>
                {/* Left Section */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={3} sx={{ padding: 2, mb: 3 }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                            <Typography variant="body2" fontWeight="bold">Pledge No:</Typography>
                            <Typography
                                sx={{
                                    color: '#B8860B', fontSize: '18px', marginBottom: '20px',
                                    fontWeight: 600, textAlign: 'center'
                                }}
                            >
                                PLEDGE TRANSACTION
                            </Typography>
                            <TextField
                                type="date"
                                size="small"
                                label="PLEDGE DATE"
                                sx={{
                                    '& .MuiInputLabel-root': { fontSize: '14px', fontWeight: 'bold' },
                                    '& .MuiInputBase-root': { fontSize: '14px' }
                                }}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ readOnly: true }}
                            />
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Autocomplete
                                    options={pledgeNumberOptions}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Pledge Number"
                                            name="pledgeNumber"
                                            size="small"
                                            fullWidth
                                            sx={{
                                                '& .MuiInputLabel-root': { fontSize: '14px', fontWeight: 'bold' },
                                                '& .MuiInputBase-root': { fontSize: '14px' },
                                            }}
                                        />
                                    )}
                                    value={formData.pledgeNumber}
                                    onChange={(e, newValue) => {
                                        setFormData({
                                            ...formData,
                                            pledgeNumber: newValue, // Store the entire object for further use.
                                        });
                                    }}
                                    fullWidth
                                />
                            </Grid>

                            {pledges.map((pledge) => (
                                ['bankName', 'principalAmount', 'interestRate', 'otherCharges', 'dueDate'].map((field) => (
                                    <Grid item xs={12} sm={6} md={4} key={`${pledge.pledgeId}-${field}`}>
                                        <TextField
                                            fullWidth
                                            label={field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                                            name={field}
                                            value={pledge[field] || ''}
                                            size="small"
                                            type={field === 'dueDate' ? 'date' : 'text'}
                                            InputLabelProps={field === 'dueDate' ? { shrink: true } : {}}
                                            sx={{
                                                '& .MuiInputLabel-root': { fontSize: '14px', fontWeight: 'bold' },
                                                '& .MuiInputBase-root': { fontSize: '14px' }
                                            }}
                                        />
                                    </Grid>
                                ))
                            ))}

                            <Grid item xs={12} sm={8} md={8}>
                                <TextField
                                    fullWidth
                                    label="Remarks"
                                    name="remarks"
                                    value={formData.remarks}
                                    onChange={handleInputChange}
                                    size="small"
                                    multiline
                                    rows={2}
                                    sx={{
                                        '& .MuiInputLabel-root': { fontSize: '14px', fontWeight: 'bold' },
                                        '& .MuiInputBase-root': { fontSize: '14px' }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TableContainer component={Paper} sx={{
                                    mt: 2,
                                    '&::-webkit-scrollbar': { width: '4px', height: '4px' },
                                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '2px' },
                                    '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' },
                                    '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1' },
                                }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontSize: '0.675rem' }}>Item Details</TableCell>
                                                <TableCell sx={{ fontSize: '0.675rem' }}>No</TableCell>
                                                <TableCell sx={{ fontSize: '0.675rem' }}>Gross Wt</TableCell>
                                                <TableCell sx={{ fontSize: '0.675rem' }}>Stone Wt</TableCell>
                                                <TableCell sx={{ fontSize: '0.675rem' }}>Dep Wt</TableCell>
                                                <TableCell sx={{ fontSize: '0.675rem' }}>Net Wt</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {pledges.map((pledge) => (
                                                <TableRow key={pledge.pledgeId}>
                                                    <TableCell sx={{ fontSize: '0.675rem' }}>{pledge.itemDetails}</TableCell>
                                                    <TableCell sx={{ fontSize: '0.675rem' }}>{pledge.pledgeId}</TableCell>
                                                    <TableCell sx={{ fontSize: '0.675rem' }}>{pledge.principalAmount}</TableCell>
                                                    <TableCell sx={{ fontSize: '0.675rem' }}>{pledge.loanDuration}</TableCell>
                                                    <TableCell sx={{ fontSize: '0.675rem' }}>{pledge.interestRate}</TableCell>
                                                    <TableCell sx={{ fontSize: '0.675rem' }}>{pledge.otherCharges}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                    <SearchModal />
                                </Grid>

                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Right Section */}
                <Grid item xs={12} md={5}>
                    <Paper elevation={3} sx={{ padding: 2, mb: 3 }}>
                        <Box component="form" onSubmit={handleSubmit}>
                            Billing
                            <Grid container spacing={2}>
                                {['paidAmount', 'paidPrincipal', 'paidInterest', 'paidOtherCharges'].map((field) => (
                                    <Grid item xs={12} sm={6} md={6} key={field}>
                                        <TextField
                                            fullWidth
                                            label={field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                                            name={field}
                                            value={formData[field]}
                                            onChange={handleInputChange}
                                            size="small"
                                            sx={{
                                                '& .MuiInputLabel-root': { fontSize: '14px', fontWeight: 'bold' },
                                                '& .MuiInputBase-root': { fontSize: '14px' }
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <Button type="submit" variant="contained" sx={{ mt: 2, bgcolor: '#B8860B', color: '#FFF', '&:hover': { bgcolor: '#FFD700' } }}>Submit</Button>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
